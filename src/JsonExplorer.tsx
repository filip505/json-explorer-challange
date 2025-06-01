import React, { useState } from "react";

interface JsonExplorerProps {
  data: any;
}

const JsonExplorer: React.FC<JsonExplorerProps> = ({ data }) => {
  const [selectedKeyInfo, setSelectedKeyInfo] = useState<{
    path: string;
    value: any;
  } | null>(null);

  const getValueByPath = (obj: any, path: string): any => {
    const cleanPath = path.startsWith("res.") ? path.substring(4) : path;

    try {
      const segments = cleanPath.match(/(\w+|\[\d+\])/g);
      console.log("segments", segments);
      if (!segments) return undefined;

      let current = obj;
      for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        console.log("segment " + i, segment);

        if (segment.startsWith("[") && segment.endsWith("]")) {
          const index = parseInt(segment.slice(1, -1));
          if (
            Array.isArray(current) &&
            !isNaN(index) &&
            index < current.length
          ) {
            current = current[index];
          } else {
            return undefined;
          }
        } else {
          if (current.hasOwnProperty(segment)) {
            console.log("current[segment]", current[segment]);
            current = current[segment];
          } else {
            return undefined;
          }
        }
      }
      return isObject(current) ? undefined : current;
    } catch (e) {
      console.error("Error getting value by path:", e);
      return undefined;
    }
  };

  const handlePathInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = e.target.value;
    setSelectedKeyInfo({ path: newPath, value: getValueByPath(data, newPath) });
  };

  const isObject = (value: unknown) =>
    value !== null && typeof value === "object";

  const renderNode = (
    key: string | number | boolean,
    value: any,
    currentParentPath: string,
    depth: number,
    isLastItemInCollection: boolean
  ) => {
    const getCurrentPath = (
      currentParentPath: String,
      key: string | number | boolean
    ) => {
      let fullClickablePath: string;
      if (currentParentPath === "") {
        fullClickablePath = `res.${key}`;
      } else if (typeof key === "number") {
        fullClickablePath = `${currentParentPath}[${key}]`;
      } else if (key !== null) {
        fullClickablePath = `${currentParentPath}.${key}`;
      } else {
        fullClickablePath = `${currentParentPath}`;
      }
      return fullClickablePath;
    };

    const renderKeySpan = (displayKey: string) =>
      !isObject(value) ? (
        <span
          className={"json-path-clickable"}
          onClick={() => {
            setSelectedKeyInfo({ path: fullClickablePath, value: value });
          }}
        >
          "{displayKey}"
        </span>
      ) : (
        <span>"{displayKey}"</span>
      );

    const renderValueSpan = (val: any) => {
      let displayValue = String(val);
      if (typeof val === "string") {
        return <span>{'"' + displayValue + '"'}</span>;
      } else {
        return <span>{displayValue}</span>;
      }
    };

    const tab = "  ".repeat(depth);
    const fullClickablePath = getCurrentPath(currentParentPath, key);

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        const arrayItems = value.map((item, index) => (
          <div key={`${fullClickablePath}[${index}]`}>
            {renderNode(
              index,
              item,
              fullClickablePath,
              depth + 1,
              index === value.length - 1
            )}
          </div>
        ));

        return (
          <>
            <div>
              <span>{tab}</span>
              {key !== null && renderKeySpan(String(key))}
              {key !== null && <span>: </span>}
              <span>[</span>
            </div>
            {value.length > 0 && arrayItems}
            <div>
              <span>{tab}</span>
              <span>]</span>
              {!isLastItemInCollection && <span>,</span>}{" "}
            </div>
          </>
        );
      } else {
        const objectKeys = Object.keys(value);
        const objectProperties = objectKeys.map((k, index) => (
          <div key={`${fullClickablePath}.${k}`}>
            {renderNode(
              k,
              value[k],
              fullClickablePath,
              depth + 1,
              index === objectKeys.length - 1
            )}
          </div>
        ));

        return (
          <>
            <div>
              <span>{tab}</span>
              {key !== null && renderKeySpan(String(key))}
              {key !== null && <span>: </span>}
              <span>{"{"}</span>
            </div>
            {objectKeys.length > 0 && objectProperties}
            <div>
              <span>{tab}</span>
              <span>{"}"}</span>
              {!isLastItemInCollection && <span>,</span>}
            </div>
          </>
        );
      }
    } else {
      return (
        <div key={fullClickablePath}>
          <span>{tab}</span>
          {key !== null && (
            <>
              {renderKeySpan(String(key))}
              <span>: </span>
            </>
          )}
          {renderValueSpan(value)}
          {!isLastItemInCollection && <span>,</span>}{" "}
        </div>
      );
    }
  };

  const rootKeys = Object.keys(data);

  return (
    <div className="container">
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter path"
          value={selectedKeyInfo?.path || ""}
          style={{ width: "300px", padding: "8px" }}
          onChange={handlePathInputChange}
        />
      </div>
      <div className="json-display-area">
        <div>
          <span>{"{"}</span>
        </div>
        {rootKeys.map((key, index) => (
          <div key={key}>
            {renderNode(key, data[key], "", 1, index === rootKeys.length - 1)}
          </div>
        ))}
        <div>
          <span>{"}"}</span>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        {selectedKeyInfo && JSON.stringify(selectedKeyInfo.value)}
      </div>
    </div>
  );
};

export default JsonExplorer;
