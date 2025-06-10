import { visit } from 'unist-util-visit';
 
export default function brPreserver() {
  return function(tree) {
    visit(tree, 'html', node => {
      if (node.value === '<br/>') {
        node.type = 'break'; // 修改节点类型以保持 <br/> 标签
      }
    });
  };
}