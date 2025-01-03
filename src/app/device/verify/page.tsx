import { CodeForm } from "./_components/code-form";

export default function Verify() {
  return (
    <div>
      <h1>Verify Device</h1>
      <p>
        To verify your device, please enter the code displayed on the device.
      </p>
      <CodeForm />
    </div>
  );
}
