// Netlify serverless function to proxy Airtable requests
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    console.log('Function called with event:', JSON.stringify(event, null, 2));
    
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

        console.log('Env vars loaded:', { 
            hasKey: !!AIRTABLE_API_KEY,
            hasBaseId: !!AIRTABLE_BASE_ID
        });

        // Check if environment variables are set
        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing environment variables');
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
        console.log('Query params:', params);
        
        const { table, action = 'list', recordId, filter } = params;

        // Validate required parameters
        if (!table) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Table parameter is required',
                    validTables: ['attendance', 'locations', 'employees']
                })
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
                body: JSON.stringify({ 
                    error: `Invalid table: ${table}`,
                    validTables: Object.keys(TABLE_MAP)
                })
            };
        }

        // Get table ID
        const tableId = TABLE_MAP[table];
        
        // Construct base Airtable URL
        let airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`;
        
        // Add record ID for update operations
        if (recordId && (action === 'update' || action === 'patch')) {
            airtableUrl = `${airtableUrl}/${recordId}`;
        }
        
        // Build query parameters
        let queryParams = [];
        
        if (filter && action === 'list') {
            queryParams.push(`filterByFormula=${encodeURIComponent(filter)}`);
        }
        
        // Add sorting for attendance table
        if (table === 'attendance' && action === 'list') {
            queryParams.push('sort%5B0%5D%5Bfield%5D=Timestamp&sort%5B0%5D%5Bdirection%5D=desc');
        }
        
        // For employees view
        if (table === 'employees' && action === 'list' && !filter) {
            queryParams.push('view=Grid%20view');
        }
        
        if (queryParams.length > 0) {
            airtableUrl += `?${queryParams.join('&')}`;
        }

        console.log('Final Airtable URL:', airtableUrl);

        // Determine HTTP method
        let method = 'GET';
        let requestBody = null;
        
        if (action === 'create') {
            method = 'POST';
        } else if (action === 'update' || action === 'patch') {
            method = 'PATCH';
        }
        
        // Parse request body if exists
        if (event.body && (action === 'create' || action === 'update' || action === 'patch')) {
            try {
                const body = JSON.parse(event.body);
                requestBody = JSON.stringify({ fields: body.fields });
            } catch (e) {
                console.error('Error parsing request body:', e);
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

        console.log('Making Airtable request with options:', {
            method: options.method,
            hasBody: !!options.body,
            url: airtableUrl
        });
        
        const response = await fetch(airtableUrl, options);
        const data = await response.json();
        
        console.log('Airtable response status:', response.status);
        
        // Return the response
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
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
