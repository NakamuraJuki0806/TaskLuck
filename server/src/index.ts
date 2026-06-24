type APIGatewayProxyEvent = {
  body?: string | null;
  headers?: Record<string, string | undefined>;
  httpMethod?: string;
  path?: string;
  queryStringParameters?: Record<string, string | undefined> | null;
};

type APIGatewayProxyResult = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Hello from CRUD Lambda!' }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: message,
      }),
    };
  }
};