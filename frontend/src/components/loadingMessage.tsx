import React, { useEffect, useState } from 'react';
import favicon from '../assets/images/favicon.svg';

interface LoadingMessageProps {
    ref: React.Ref<HTMLDivElement>;
}

const LoadingMessage = React.forwardRef<HTMLDivElement, LoadingMessageProps>(
    (_, ref) => {
        const [step, setStep] = useState(0);
        const steps = ['Enviando', 'Consultando FIPE API', 'Gerando mensagem'];

        useEffect(() => {
            const interval = setInterval(() => {
                setStep((prev) => {
                    const nextStep = (prev + 1) % steps.length;
                    if (nextStep === 0) clearInterval(interval);
                    return nextStep;
                });
            }, 4000);
            return () => clearInterval(interval);
        }, []);

        return (
            <div
                ref={ref}
                className="flex w-full items-start justify-start p-5"
            >
                <div className="clip-message-left block h-3 w-1 bg-neutral-100"></div>
                <div className="flex w-7/12 flex-col gap-1 rounded-r-lg rounded-bl-lg bg-neutral-100 p-2">
                    <span className="mb-1 flex items-center gap-1 text-sm text-neutral-700">
                        <span className="flex items-center gap-1 text-sm font-bold text-black">
                            <img
                                src={favicon}
                                alt="black rocket"
                                className="h-3 w-3"
                            />
                            Renova IA
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            {steps[step]}
                            <span className="loading-dots">
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </span>
                        </span>
                    </span>
                </div>
            </div>
        );
    },
);

export default LoadingMessage;
