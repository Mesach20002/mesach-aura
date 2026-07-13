"use client"

import { useActionState, useState } from "react"
import {
  IconDroplet,
  IconLoader2,
  IconLock,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  initialConsentFormState,
  submitConsentOnboarding,
} from "@/lib/consent/actions"
import {
  ageRangeOptions,
  genderIdentityOptions,
  routineOptions,
  sensitivityOptions,
  skinConcernOptions,
  skinTypeOptions,
} from "@/lib/consent/config"

type ConsentOnboardingFormProps = {
  defaultName: string
  email: string
}

type RequiredConsent =
  "cosmeticAcknowledgement" | "imageProcessingConsent" | "privacyConsent"

const initialConsents: Record<RequiredConsent, boolean> = {
  cosmeticAcknowledgement: false,
  imageProcessingConsent: false,
  privacyConsent: false,
}

export function ConsentOnboardingForm({
  defaultName,
  email,
}: ConsentOnboardingFormProps) {
  const [state, formAction, pending] = useActionState(
    submitConsentOnboarding,
    initialConsentFormState
  )
  const [consents, setConsents] = useState(initialConsents)
  const hasAcceptedAll = Object.values(consents).every(Boolean)

  function updateConsent(name: RequiredConsent, accepted: boolean) {
    setConsents((current) => ({ ...current, [name]: accepted }))
  }

  return (
    <form action={formAction} className="space-y-6">
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="gap-4 border-b border-border">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconUser className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <CardTitle className="font-heading text-xl tracking-normal normal-case">
              About you
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              We collect only the details needed to personalize cosmetic
              guidance.
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
          <FormField
            label="Preferred name"
            htmlFor="preferredName"
            error={state.errors.preferredName}
          >
            <Input
              id="preferredName"
              name="preferredName"
              defaultValue={defaultName}
              maxLength={80}
              autoComplete="name"
              aria-invalid={Boolean(state.errors.preferredName)}
              required
            />
          </FormField>

          <FormField label="Signed-in email" htmlFor="email">
            <Input id="email" value={email} readOnly disabled />
          </FormField>

          <FormField
            label="Age range"
            htmlFor="ageRange"
            error={state.errors.ageRange}
          >
            <Select name="ageRange" required>
              <SelectTrigger id="ageRange" className="w-full">
                <SelectValue placeholder="Select your age range" />
              </SelectTrigger>
              <SelectContent>
                {ageRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Gender identity (optional)"
            htmlFor="genderIdentity"
          >
            <Select name="genderIdentity">
              <SelectTrigger id="genderIdentity" className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {genderIdentityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Country or region (optional)" htmlFor="country">
            <Input
              id="country"
              name="country"
              maxLength={80}
              autoComplete="country-name"
              placeholder="e.g. Kenya"
            />
          </FormField>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="gap-4 border-b border-border">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconDroplet className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <CardTitle className="font-heading text-xl tracking-normal normal-case">
              Your skin profile
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These are self-reported cosmetic observations, not clinical
              findings.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-7 pt-6">
          <FormField
            label="How would you describe your skin?"
            htmlFor="selfReportedSkinType"
            error={state.errors.selfReportedSkinType}
          >
            <Select name="selfReportedSkinType" required>
              <SelectTrigger id="selfReportedSkinType" className="w-full">
                <SelectValue placeholder="Select your skin type" />
              </SelectTrigger>
              <SelectContent>
                {skinTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold tracking-wide text-foreground uppercase">
              What would you like to focus on?
            </legend>
            <p className="text-sm text-muted-foreground">
              Select at least one.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {skinConcernOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm transition-colors hover:bg-accent/50"
                >
                  <Checkbox
                    name="skinConcerns"
                    value={option.value}
                    aria-invalid={Boolean(state.errors.skinConcerns)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <FieldError message={state.errors.skinConcerns} />
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold tracking-wide text-foreground uppercase">
              How sensitive does your skin usually feel?
            </legend>
            <RadioGroup
              name="skinSensitivity"
              className="grid gap-3 sm:grid-cols-2"
              required
            >
              {sensitivityOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`sensitivity-${option.value}`}
                  className="cursor-pointer rounded-lg border border-border bg-background p-3 normal-case"
                >
                  <RadioGroupItem
                    id={`sensitivity-${option.value}`}
                    value={option.value}
                  />
                  {option.label}
                </Label>
              ))}
            </RadioGroup>
            <FieldError message={state.errors.skinSensitivity} />
          </fieldset>

          <FormField
            label="Current skincare routine"
            htmlFor="routineConsistency"
            error={state.errors.routineConsistency}
          >
            <Select name="routineConsistency" required>
              <SelectTrigger id="routineConsistency" className="w-full">
                <SelectValue placeholder="Select your current routine" />
              </SelectTrigger>
              <SelectContent>
                {routineOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label="Known allergies or sensitivities (optional)"
              htmlFor="allergiesOrSensitivities"
            >
              <Textarea
                id="allergiesOrSensitivities"
                name="allergiesOrSensitivities"
                maxLength={500}
                placeholder="List ingredients or products you avoid"
              />
            </FormField>
            <FormField
              label="Primary skin goal (optional)"
              htmlFor="primarySkinGoal"
            >
              <Textarea
                id="primarySkinGoal"
                name="primarySkinGoal"
                maxLength={300}
                placeholder="What would you most like to improve?"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm">
        <CardHeader className="gap-4 border-b border-primary/15">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconShieldCheck className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <CardTitle className="font-heading text-xl tracking-normal normal-case">
              Required consent
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Please read and accept each statement before continuing.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <ConsentCheckbox
            name="cosmeticAcknowledgement"
            checked={consents.cosmeticAcknowledgement}
            onCheckedChange={(accepted) =>
              updateConsent("cosmeticAcknowledgement", accepted)
            }
          >
            I understand Aurora SkinSense provides cosmetic and wellness
            guidance only and is not a medical diagnosis or substitute for
            professional care.
          </ConsentCheckbox>
          <ConsentCheckbox
            name="imageProcessingConsent"
            checked={consents.imageProcessingConsent}
            onCheckedChange={(accepted) =>
              updateConsent("imageProcessingConsent", accepted)
            }
          >
            I consent to processing my uploaded or captured face image to
            generate my cosmetic skin report. The image is not retained by
            default.
          </ConsentCheckbox>
          <ConsentCheckbox
            name="privacyConsent"
            checked={consents.privacyConsent}
            onCheckedChange={(accepted) =>
              updateConsent("privacyConsent", accepted)
            }
          >
            I consent to Aurora securely storing this profile, my consent
            record, and generated reports so the service can provide
            personalized results.
          </ConsentCheckbox>

          <FieldError message={state.errors.consent} />

          <div className="flex items-start gap-3 rounded-lg bg-background/80 p-4 text-sm text-muted-foreground">
            <IconLock
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden
            />
            <p>
              You can request deletion of your profile and reports from account
              settings. A new consent version will require your approval again.
            </p>
          </div>
        </CardContent>
      </Card>

      {state.message ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full"
        disabled={!hasAcceptedAll || pending}
      >
        {pending ? (
          <>
            <IconLoader2 className="size-4 animate-spin" aria-hidden />
            Saving securely...
          </>
        ) : (
          "Accept and Continue to Scan"
        )}
      </Button>
    </form>
  )
}

function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="text-xs text-destructive" role="alert">
      {message}
    </p>
  ) : null
}

function ConsentCheckbox({
  name,
  checked,
  onCheckedChange,
  children,
}: {
  name: RequiredConsent
  checked: boolean
  onCheckedChange: (accepted: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm leading-6 text-foreground">
      <Checkbox
        name={name}
        value="accepted"
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        required
      />
      <span>{children}</span>
    </label>
  )
}
