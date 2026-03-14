import Button from "./Button";
import Input from "./Input";
import Tab from "./Tab";

export default function CommonComponentsGuide() {
  return (
    // 공통 원자 컴포넌트(Button/Input/Tab) 샘플 가이드
    <section className="space-y-6">
      <h2>Common Components</h2>
      <p>
        Place atomic UI elements here, such as buttons, inputs, badges, and icons.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button variant="gnb">Free start!</Button>
        <Button variant="primary" size="default">
          Explore
        </Button>
        <Button variant="outline" size="large">
          Learn more
        </Button>
        <Button variant="text" state="hover">
          More details
        </Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Input placeholder="placeholder" />
        <Input state="focus" value="placeholder" />
        <Input disabled value="placeholder" />
        <Input variant="dropdown" label="dropdown" />
        <Input variant="dropdown" label="dropdown" state="focus" />
        <Input variant="dropdown" label="dropdown" disabled />
      </div>
      <div className="flex flex-wrap gap-4 rounded-box bg-bg px-4 py-4">
        <Tab state="on">Tab</Tab>
        <Tab state="off">Tab</Tab>
        <Tab state="hover">Tab</Tab>
      </div>
    </section>
  );
}
