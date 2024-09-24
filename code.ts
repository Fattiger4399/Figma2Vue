"use strict";
figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  if (msg.type === 'get-all-nodes-with-properties') {
    // 递归函数，遍历节点及其子节点
    const getNodeProperties = (node: SceneNode) => {
      const nodeProperties: { [key: string]: any } = {};

      // 使用 for...in 遍历节点的所有属性
      for (const prop in node) {
        try {
          // 捕获并保存属性值
          nodeProperties[prop] = (node as any)[prop];
        } catch (error) {
          // 如果某个属性无法访问，记录错误
          nodeProperties[prop] = `Error: ${error}`;
        }
      }

      // 如果节点有子节点，则递归处理子节点
      let children: any[] = [];
      if ("children" in node) {
        children = node.children.map((child) => getNodeProperties(child));
      }

      return {
        id: node.id,
        name: node.name,
        type: node.type,
        properties: nodeProperties,
        children: children,
      };
    };

    // 遍历当前页面的所有节点，并递归处理每个节点
    const allNodesWithProperties = figma.currentPage.children.map((node) => getNodeProperties(node));

    // 将节点及其属性发送回 UI
    figma.ui.postMessage({ type: 'all-nodes-with-properties', nodes: allNodesWithProperties });
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
