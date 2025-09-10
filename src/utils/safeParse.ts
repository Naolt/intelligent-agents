function safeParse(json: any, maxDepth = 3): any {
  let parsed = json;
  let depth = 0;

  while (typeof parsed === "string" && depth < maxDepth) {
    try {
      parsed = JSON.parse(parsed);
      depth++;
    } catch {
      break;
    }
  }

  return parsed;
}

export {safeParse}