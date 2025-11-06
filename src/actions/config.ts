export async function configAction(
  options: { local?: true | undefined; global?: true | undefined },
) {
  console.log("Config action");
  console.log("Options:", options);
}
