import { Monitor, Smartphone } from "lucide-react";

function DeviceToggle({
  value,
  onChange,
}) {
  const devices = [
    {
      id: "desktop",
      label: "Desktop",
      description: "Desktop Lighthouse audit",
      icon: Monitor,
    },
    {
      id: "mobile",
      label: "Mobile",
      description: "Mobile Lighthouse audit",
      icon: Smartphone,
    },
  ];

  return (
    <div>
      <div className="mb-2">
        <p className="text-sm font-semibold text-[#181827]">
          Device
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Choose the device profile for the audit.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {devices.map((device) => {
          const Icon = device.icon;
          const selected = value === device.id;

          return (
            <button
              key={device.id}
              type="button"
              onClick={() =>
                onChange(device.id)
              }
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-[#8b5cf6] bg-[#faf5ff] ring-2 ring-[#8b5cf6]/10"
                  : "border-[#eeeafd] bg-white hover:border-[#ddd1ff] hover:bg-[#faf9ff]"
              }`}
              aria-pressed={selected}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  selected
                    ? "bg-[#f3e8ff] text-[#7c3aed]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon size={19} />
              </div>

              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    selected
                      ? "text-[#7c3aed]"
                      : "text-[#181827]"
                  }`}
                >
                  {device.label}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  {device.description}
                </p>
              </div>

              <span
                className={`ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  selected
                    ? "border-[#7c3aed]"
                    : "border-gray-300"
                }`}
              >
                {selected && (
                  <span className="h-2 w-2 rounded-full bg-[#7c3aed]" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DeviceToggle;