// spl/dev/create - Create a new dev environment
import { randomUUID } from 'crypto';

export default async function create(ctx, input) {
  const { name, template } = input;

  // TODO: Actually create environment directory
  // For now, return the expected structure

  return {
    output: {
      envId: randomUUID(),
      path: `/tmp/dev-env/${name}`,
      status: 'created'
    }
  };
}
