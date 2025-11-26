// module_node default node handler
// Standard async signature - all derived types inherit unless overridden

export default async function(context) {
  // TODO: completion action (async)
  // 1. Set context.transfer to output ({} for default)
  // 2. Set request status to normal completion
  // 3. Fire event record (fire and forget)
  // await context.complete({});
}
