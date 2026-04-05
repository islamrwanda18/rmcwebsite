import BasicCMS from "./BasicCMS";

export default function StatisticsCMS() {
  return (
    <BasicCMS 
      collectionName="statistics" 
      titleLabel="Public Statistics" 
      fields={[
        { name: "label", label: "Statistic Label (e.g. Schools)", type: "text" },
        { name: "value", label: "Value (e.g. 50+)", type: "text" },
        { name: "order", label: "Display Order (number)", type: "number" }
      ]} 
    />
  );
}
