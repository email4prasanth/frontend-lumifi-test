import { tickIcon } from '@/assets/images';
import { Image } from '@/lib/ui/components/image';
import React from 'react';

type Step = {
  id: number;
  label: string;
};

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className='relative flex justify-between items-center mb-8 sm:px-8'>
      <div className='absolute bottom-3 left-[calc(2rem-1px)] right-[calc(2rem-1px)] sm:left-[calc(4rem-1px)] sm:right-[calc(4rem-1px)]'>
        {steps.map((_, index) => {
          if (index === steps.length - 1) return null;
          const isCompleted = index < currentStep;

          return (
            <div
              data-testid='progress-line'
              key={index}
              className={`absolute h-[1px] top-0
                ${isCompleted ? 'bg-[#009BDF]' : 'bg-[#009cdf67]'}
                transition-colors duration-300`}
              style={{
                left: `${(index / (steps.length - 1)) * 100}%`,
                width: `${100 / (steps.length - 1)}%`,
              }}
            />
          );
        })}
      </div>

      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        return (
          <div
            data-testid='step-container'
            key={step.id}
            className='flex flex-col justify-center sm:min-w-20 items-center relative z-10'
          >
            <div
              data-testid='step-label'
              className={`text-center uppercase text-[10px] mb-2 font-semibold break-words whitespace-pre-wrap max-w-[60px] leading-tight ${
                isCompleted ? 'text-[#57A73B]' : isActive ? 'text-[#005399]' : 'text-[#84888C]'
              }`}
            >
              {step.label}
            </div>
            <div
              data-testid='step-circle'
              className={`w-6 h-6 rounded-full flex items-center justify-center
              ${
                isCompleted
                  ? 'border-2 border-[#57A73B] bg-white'
                  : isActive
                    ? ' bg-[#009BDF] text-[#005399]'
                    : 'border-[1px] border-[#009BDF] bg-white text-[#84888C]'
              }`}
            >
              {isCompleted ? (
                <Image
                  data-testid='tick-icon'
                  src={tickIcon}
                  alt='tick-icon'
                  className='w-[18px] h-[18px] '
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
