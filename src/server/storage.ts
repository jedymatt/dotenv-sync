import 'server-only';

import { faker } from '@faker-js/faker';

export async function getEnvFileContents(envPath: string) {

    return `
    # Example .env file
    API_KEY=${faker.string.ulid()}
    DB_USER=root
    `;

    // try {
    //     const blobDetails = await head(envPath);


    //     const file = await fetch(blobDetails.url);

    //     return await file.text();
    // } catch (e) {
    //     console.log(`Error fetching env file: ${envPath}`);
    //     return null;
    // }
}