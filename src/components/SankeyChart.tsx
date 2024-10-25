import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyGraph, SankeyNode, SankeyLink } from 'd3-sankey';
import { BillItem } from '../types';

interface SankeyChartProps {
  income: number;
  savings: number;
  billItems: BillItem[];
}

interface SankeyNodeExtended extends SankeyNode<{}, {}> {
  name: string;
}

export default function SankeyChart({ income, savings, billItems }: SankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node()!.getBoundingClientRect().width;
    const height = 700;

    // Clear previous chart
    svg.selectAll('*').remove();

    // Calculate total bills
    const billsValue = billItems.reduce((total, item) => total + item.amount, 0);

    // Create graph data
    const graph: SankeyGraph<SankeyNodeExtended, SankeyLink<SankeyNodeExtended, {}>> = {
      nodes: [
        { name: "Income" },
        { name: "Bills" },
        { name: "Savings" },
        ...billItems.map(item => ({ name: item.name || "Unnamed" }))
      ],
      links: [
        { source: 0, target: 1, value: billsValue },
        { source: 0, target: 2, value: savings },
        ...billItems.map((item, index) => ({
          source: 1,
          target: index + 3,
          value: item.amount
        }))
      ]
    };

    // Create sankey generator
    const sankeyGenerator = sankey<SankeyNodeExtended, SankeyLink<SankeyNodeExtended, {}>>()
      .nodeWidth(10)
      .nodePadding(20)
      .extent([[1, 1], [width - 1, height - 6]]);

    // Generate the sankey diagram
    const { nodes, links } = sankeyGenerator(graph);

    // Draw links
    svg.append("g")
      .selectAll(".link")
      .data(links)
      .join("path")
      .attr("class", "link")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke-width", d => Math.max(1, d.width ?? 0))
      .attr("stroke", "#007bff")
      .style("fill", "none")
      .style("stroke-opacity", 0.4);

    // Draw nodes
    const node = svg.append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node");

    node.append("rect")
      .attr("x", d => d.x0 ?? 0)
      .attr("y", d => d.y0 ?? 0)
      .attr("height", d => (d.y1 ?? 0) - (d.y0 ?? 0))
      .attr("width", d => (d.x1 ?? 0) - (d.x0 ?? 0))
      .attr("fill", (_, i) => d3.schemeCategory10[i % 10])
      .style("fill-opacity", 0.8);

    // Add labels
    node.append("text")
      .attr("x", d => (d.x0 ?? 0) < width / 2 ? (d.x1 ?? 0) + 6 : (d.x0 ?? 0) - 6)
      .attr("y", d => ((d.y1 ?? 0) + (d.y0 ?? 0)) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => (d.x0 ?? 0) < width / 2 ? "start" : "end")
      .text(d => `${d.name}: $${d.value ?? 0}`);

  }, [income, savings, billItems]);

  return (
    <svg 
      ref={svgRef}
      width="100%"
      height={700}
      className="bg-white rounded-lg shadow"
    />
  );
}
