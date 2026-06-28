export function buildPrompt(document: string, userInput: string) {
  return {
    system: `You are the system. Follow the instructions in this document: ${document}`,
    user: userInput
  };
}

export function runModelCode(response: any) {
  return eval(response.text);
}
