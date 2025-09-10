function prepareSystemPrompt(prompt: string): string {
  const systemPrompt = `
        ${prompt}

        **RESPONSE FORMAT**
        - You MUST ALWAYS use the Response tool to respond to the user
        - NEVER respond without using the Response tool
        - Your response MUST be properly structured according to the Response tool schema
        - Please use the component_id to determine the type of component to render if you need to render a component. And please use the data to render the component.
        - If you need to make a tool call, make it BEFORE using the Response tool
        - The Response tool MUST be your final action
        - ALWAYS ALWAYS ALWAYS use the response tool to respond to the user
        - When responding with the response tool, if there are components that are renderable, use the response field as a text that would be rendered above the components.
        - If there are no components to render, the response field should be a text that would be rendered as a paragraph.
        
        `;

  return systemPrompt;
}

export { prepareSystemPrompt };
