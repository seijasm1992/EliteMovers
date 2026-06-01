import { useCallback, useRef, useState } from "react";
import type { MovingService } from "../../types/content";
import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";

interface Props {
  services: MovingService[];
}

export default function MovingServices({ services }: Props) {
  const [activeService, setActiveService] = useState<MovingService | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleOpen = useCallback(
    (service: MovingService, trigger: HTMLButtonElement) => {
      triggerRef.current = trigger;
      setActiveService(service);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setActiveService(null);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 items-stretch gap-12 md:grid-cols-3 md:gap-8 lg:gap-10">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onMoreInfo={handleOpen}
          />
        ))}
      </div>

      <ServiceModal
        service={activeService}
        isOpen={activeService !== null}
        onClose={handleClose}
        returnFocusRef={triggerRef}
      />
    </>
  );
}
