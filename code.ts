type Message = {
  type: "cancel" | "extract";
  owner: string;
  repo: string;
  branch: string;
};

figma.showUI(__html__, { title: "Color Extractor", width: 285, height: 165 });

figma.ui.onmessage = async (message: Message) => {
  if (message.type === "cancel") {
    figma.closePlugin();
    return;
  }

  try {
    const response = await fetch(
      `https://xxxxxxxxxxxx.netlify.app/.netlify/functions/extract?owner=${message.owner}&repo=${message.repo}&branch=${message.branch}`,
      { method: "GET" }
    );

    const svgText = await response.text();
    const newNode = figma.createNodeFromSvg(svgText);
    figma.currentPage.appendChild(newNode);
    figma.currentPage.selection = [newNode];
    figma.notify("Finished!!");
  } catch (e: unknown) {
    if (e instanceof Error) {
      figma.notify(e.message);
    }
  } finally {
    figma.ui.postMessage("finish");
  }
};
