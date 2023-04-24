import { DeleteOutlined } from "@ant-design/icons";
import { Button, Divider, Select } from "antd";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const BUILTIN_TAGS = [
  "OK",
  "备选",
  "不合适",
  "时段",
  "曾用",
  "人声",
  "音效",
  "重复",
  "版本",
  "音质",
  "过于激烈",
  "激烈",
  "催眠",
  "国产",
  "大众",
  "纯钢琴",
  "纯吉他",
  "电子",
  ...[1, 2, 3, 4, 5, 6].map((v) => `或${v}`),
];
const recentTags = atomWithStorage("recentTags", BUILTIN_TAGS);

const useTags = () => {
  const [tags, setTags] = useAtom(recentTags);

  // Select a tag, add to recent tags if not exists, and move to the top
  const select = (tag) => {
    const index = tags.indexOf(tag);
    if (index === -1) {
      setTags([tag, ...tags]);
    } else {
      setTags([tag, ...tags.slice(0, index), ...tags.slice(index + 1)]);
    }
  };

  // Clear custom tags, but maintain order of builtin tags
  const clear = () => {
    setTags(tags.filter((tag) => BUILTIN_TAGS.includes(tag)));
  };

  return [tags, select, clear];
};

const TagsSelect = (props) => {
  const [tags, select, clear] = useTags();

  return (
    <Select
      mode="tags"
      tokenSeparators={[",", "，"]}
      placement="topLeft"
      options={tags.map((tag) => ({
        label: tag,
        value: tag,
      }))}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "4px 0" }} />
          <Button block type="text" icon={<DeleteOutlined />} onClick={clear}>
            清除自定义标签
          </Button>
        </>
      )}
      onSelect={(value) => select(value)}
      {...props}
    />
  );
};

export default TagsSelect;
