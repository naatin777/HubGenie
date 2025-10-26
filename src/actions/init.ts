export const initAction = async (
  options: { local?: true | undefined; global?: true | undefined },
): Promise<void> => {
  const localFlag = options.local
  const globalFlag = options.global;

  if(localFlag && !globalFlag) {

  } else if(!localFlag && globalFlag) {

  } else {

  }
};
