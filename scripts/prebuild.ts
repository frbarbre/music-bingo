import { execSync } from "child_process";

const schemas = [
  {
    filepath: "./schema.yaml",
    baseUrl: "https://api.spotify.com/v1",
  },
];

console.log(`Generating schemas for ${schemas.length} schema(s)`);

for (const schema of schemas) {
  console.log(`Generating schemas for ${schema.filepath}...`);
  try {
    execSync(
      `bunx openapi-zod-client ${schema.filepath} --group-strategy=tag-file -o generated --export-schemas --export-types --base-url=${schema.baseUrl}`,
      {
        cwd: process.cwd(),
      }
    );
  } catch (error) {
    console.error(`Error generating schemas for ${schema.filepath}: ${error}`);
  }
}

console.log("Schemas generated successfully");
