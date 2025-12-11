// Netlify serverless function to proxy Airtable requests
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

        // Check if environment variables are set
        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Server configuration error',
                    message: 'Airtable credentials not configured'
                })
            };
        }

        // Parse query parameters
        const params = event.queryStringParameters || {};
        const { table, action = 'list', recordId, filter } = params;
        
        console.log('Function params:', { table, action, recordId, filter });

        // Validate required parameters
        if (!table) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Table parameter is required' })
            };
        }

        // Table mapping
        const TABLE_MAP = {
            'attendance': AIRTABLE_TABLE_ATTENDANCE,
            'locations': AIRTABLE_TABLE_LOCATIONS,
            'employees': AIRTABLE_TABLE_EMPLOYEES
        };

        // Validate table
        if (!TABLE_MAP[table]) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: `Invalid table: ${table}. Valid tables are: ${Object.keys(TABLE_MAP).join(', ')}` })
            };
        }

        // Construct Airtable URL
        const tableId = TABLE_MAP[table];
        let airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`;
        
        // Add record ID if provided
        if (recordId && (action === 'update' || action === 'delete')) {
            airtableUrl = `${airtableUrl}/${recordId}`;
        }

        // Prepare query parameters
        let queryParams = [];
        
        if (filter && (action === 'list' || !action)) {
            queryParams.push(`filterByFormula=${encodeURIComponent(filter)}`);
        }
        
        if (action === 'list') {
            queryParams.push('sort%5B0%5D%5Bfield%5D=Timestamp&sort%5B0%5D%5Bdirection%5D=desc');
        }
        
        if (queryParams.length > 0) {
            airtableUrl += `?${queryParams.join('&')}`;
        }

        console.log('Airtable URL:', airtableUrl);

        // Prepare request body
        let requestBody = null;
        let method = 'GET';
        
        if (event.body) {
            const body = JSON.parse(event.body);
            
            if (action === 'create') {
                method = 'POST';
                requestBody = JSON.stringify({ fields: body.fields });
            } else if (action === 'update') {
                method = 'PATCH';
                requestBody = JSON.stringify({ fields: body.fields });
            }
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

        console.log('Making request to Airtable with options:', { url: airtableUrl, method });
        
        const response = await fetch(airtableUrl, options);
        const responseData = await response.json();

        console.log('Airtable response status:', response.status);

        // Return response
        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify(responseData)
        };

    } catch (error) {
        console.error('Airtable proxy error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
