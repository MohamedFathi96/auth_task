import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useRegister } from "../services";
import { registerSchema, type RegisterFormData } from "../schemas";
import { extractValidationErrorMessage } from "@/utils/forms";

export default function RegisterPage() {
  const registerMutation = useRegister();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as RegisterFormData,
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      await registerMutation.mutateAsync({
        name: value.name,
        email: value.email,
        password: value.password,
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
          <CardDescription className="text-center">Enter your information to create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Full Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Enter your full name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={!field.state.meta.isValid ? "border-red-500" : ""}
                  />
                  {!field.state.meta.isValid && field.state.meta.isDirty && (
                    <p className="text-sm text-red-500" role="alert">
                      {field.state.meta.errors.map(extractValidationErrorMessage).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="Enter your email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={!field.state.meta.isValid ? "border-red-500" : ""}
                  />
                  {!field.state.meta.isValid && field.state.meta.isDirty && (
                    <p className="text-sm text-red-500" role="alert">
                      {field.state.meta.errors.map(extractValidationErrorMessage).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Create a password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={!field.state.meta.isValid ? "border-red-500" : ""}
                  />
                  {!field.state.meta.isValid && field.state.meta.isDirty && (
                    <p className="text-sm text-red-500" role="alert">
                      {field.state.meta.errors.map(extractValidationErrorMessage).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Confirm Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    placeholder="Confirm your password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={!field.state.meta.isValid ? "border-red-500" : ""}
                  />
                  {!field.state.meta.isValid && field.state.meta.isDirty && (
                    <p className="text-sm text-red-500" role="alert">
                      {field.state.meta.errors.map(extractValidationErrorMessage).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!canSubmit || isSubmitting || registerMutation.isPending}
                >
                  {registerMutation.isPending || isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              )}
            </form.Subscribe>

            {registerMutation.isError && (
              <p className="text-sm text-red-500 text-center">Registration failed. Please try again.</p>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
