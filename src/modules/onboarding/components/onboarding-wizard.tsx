'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'

import { Button } from '@/core/ui/primitives/button'
import { Progress } from '@/core/ui/feedback/progress'
import { cn } from '@/core/utils/cn.utils'
import { ONBOARDING_STEPS, type TOnboardingStep } from '../types/onboarding.types'
import type { TSidebarVariant } from '@/core/ui/navigation/sidebar.constants'
import type { TDateFormat } from '@/core/i18n/dates'
import { WelcomeStep } from './steps/welcome-step'
import { GeneralStep } from './steps/general-step'
import { AppearanceStep } from './steps/appearance-step'
import { TypographyStep } from './steps/typography-step'
import { ProfileStep } from './steps/profile-step'
import { CompleteStep } from './steps/complete-step'

export interface IOnboardingWizardProps {
  timezone: string
  dateFormat: TDateFormat
  sidebarVariant: TSidebarVariant
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

const STEP_COMPONENTS: Record<TOnboardingStep, React.ComponentType<any>> = {
  welcome: WelcomeStep,
  general: GeneralStep,
  appearance: AppearanceStep,
  typography: TypographyStep,
  profile: ProfileStep,
  complete: CompleteStep,
}

export function OnboardingWizard({ timezone, dateFormat, sidebarVariant, user }: IOnboardingWizardProps) {
  const t = useTranslations('onboarding')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const currentStep = ONBOARDING_STEPS[currentStepIndex]!
  const StepComponent = STEP_COMPONENTS[currentStep.id]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1
  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100

  const goNext = useCallback(() => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1)
    }
  }, [isLastStep])

  const goBack = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [isFirstStep])

  const stepProps = {
    timezone,
    dateFormat,
    sidebarVariant,
    user,
    onNext: goNext,
  }

  return (
    <div className="flex flex-col min-h-[80vh] w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <Progress value={progress} className="h-1" />
        <div className="flex justify-between mt-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors',
                index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground/40'
              )}
            >
              <span className="size-5 rounded-full border flex items-center justify-center text-[9px]">
                {index + 1}
              </span>
              <span className="hidden sm:inline">{t(`${step.id}.title`)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 animate-in fade-in-50 slide-in-from-right-2 duration-300">
        <StepComponent {...stepProps} />
      </div>

      {!isFirstStep && !isLastStep && (
        <div className="flex justify-between items-center pt-8 border-t border-border/40 mt-8">
          <Button variant="ghost" onClick={goBack} className="gap-2">
            <ChevronLeft className="size-4" />
            {t('navigation.back')}
          </Button>

          <div className="flex gap-2">
            {currentStep.isSkippable && (
              <Button variant="outline" onClick={goNext} className="gap-2">
                <SkipForward className="size-4" />
                {t('navigation.skip')}
              </Button>
            )}
            <Button onClick={goNext} className="gap-2">
              {t('navigation.next')}
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
