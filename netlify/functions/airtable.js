// Netlify serverless function to proxy Airtable requests
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Get environment variables
        const {
            AIRTABLE_API_KEY,
            AIRTABLE_BASE_ID,
            AIRTABLE_TABLE_ATTENDANCE,
            AIRTABLE_TABLE_LOCATIONS,
            AIRTABLE_TABLE_EMPLOYEES
        } = process.env;

        // Table mapping
        const TABLE_MAP = {
            'attendance': AIRTABLE_TABLE_ATTENDANCE,
            'locations': AIRTABLE_TABLE_LOCATIONS,
            'employees': AIRTABLE_TABLE_EMPLOYEES
        };

        // Parse request
        const { table, action, recordId, filter } = event.queryStringParameters || {};
        const body = event.body ? JSON.parse(event.body) : {};
        
        // Validate table
        if (!TABLE_MAP[table]) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid table specified' })
            };
        }

        // Construct Airtable URL
        const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_MAP[table]}`;
        
        let url = airtableUrl;
        let method = 'GET';
        let requestBody = null;
        let queryParams = '';

        // Determine action
        switch (action) {
            case 'create':
                method = 'POST';
                requestBody = JSON.stringify({ fields: body.fields });
                break;
            case 'update':
                method = 'PATCH';
                url = `${airtableUrl}/${recordId}`;
                requestBody = JSON.stringify({ fields: body.fields });
                break;
            case 'list':
                if (filter) {
                    queryParams = `?filterByFormula=${encodeURIComponent(filter)}`;
                } else if (body.view) {
                    queryParams = `?view=${encodeURIComponent(body.view)}`;
                }
                break;
            default:
                // Default to listing
                if (filter) {
                    queryParams = `?filterByFormula=${encodeURIComponent(filter)}`;
                }
        }

        // Add query params
        if (queryParams) {
            url += queryParams;
        }

        // Prepare headers for Airtable
        const airtableHeaders = {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        };

        // Make request to Airtable
        const options = {
            method: method,
            headers: airtableHeaders
        };

        if (requestBody) {
            options.body = requestBody;
        }

        const response = await fetch(url, options);
        const data = await response.json();

        // Return response
        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Airtable proxy error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};
