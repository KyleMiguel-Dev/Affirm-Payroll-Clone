import React, { useRef, useState } from 'react';
import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import * as Tabs from '@radix-ui/react-tabs';
import ErrorBoundary from '@/components/features/ErrorBoundary';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/password-input';
import ManagePasskeys from '@/components/manage-passkeys';
import ManageTwoFactor from '@/components/manage-two-factor';
import AppearanceTabs from '@/components/appearance-tabs';
import { User, Lock, Palette } from 'lucide-react';
import type { Auth } from '@/types';

type PageProps = {
  auth: Auth;
};

interface SettingsProps {
  mustVerifyEmail: boolean;
  status?: string;
  passwordRules: string;
  canManageTwoFactor: boolean;
  requiresConfirmation: boolean;
  twoFactorEnabled: boolean;
  canManagePasskeys: boolean;
  passkeys: any[];
}

export default function SettingsPage(props: SettingsProps) {
  const { auth } = usePage<PageProps>().props;
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('profile');

  const tabClasses = {
    list: 'flex border-b border-gray-200 bg-white rounded-t-lg',
    trigger:
      'px-6 py-3 font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors data-[state=active]:text-blue-600 data-[state=active]:border-blue-600',
    content: 'p-6 bg-white rounded-b-lg',
  };

  return (
    <ErrorBoundary>
      <Head title="Settings" />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-gray-50">
        {/* Page Content */}
        <div className="px-4 md:px-8 py-8 w-full max-w-4xl mx-auto">
          {/* Page Title Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-lg text-gray-600">Manage your account settings and preferences</p>
          </div>

          {/* Tabs Container */}
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Tab List */}
            <Tabs.List className={tabClasses.list}>
              <Tabs.Trigger value="profile" className={tabClasses.trigger}>
                <User className="inline-block mr-2" size={18} />
                Profile
              </Tabs.Trigger>
              <Tabs.Trigger value="security" className={tabClasses.trigger}>
                <Lock className="inline-block mr-2" size={18} />
                Security
              </Tabs.Trigger>
              <Tabs.Trigger value="appearance" className={tabClasses.trigger}>
                <Palette className="inline-block mr-2" size={18} />
                Appearance
              </Tabs.Trigger>
            </Tabs.List>

            {/* Profile Tab */}
            <Tabs.Content value="profile" className={tabClasses.content}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                  <p className="text-gray-600">Update your name and email address</p>
                </div>

                <Form
                  {...ProfileController.update.form()}
                  options={{
                    preserveScroll: true,
                  }}
                  className="space-y-6"
                >
                  {({ processing, errors }) => (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                          defaultValue={auth.user.name}
                          name="name"
                          required
                          autoComplete="name"
                          placeholder="Full name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                          defaultValue={auth.user.email}
                          name="email"
                          required
                          autoComplete="username"
                          placeholder="Email address"
                        />
                        <InputError className="mt-2" message={errors.email} />
                      </div>

                      {props.mustVerifyEmail && auth.user.email_verified_at === null && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            Your email address is unverified.{' '}
                            <Link
                              href={'/verification-link/send'}
                              as="button"
                              className="text-yellow-900 underline font-medium hover:text-yellow-700"
                            >
                              Click here to re-send the verification email.
                            </Link>
                          </p>
                          {props.status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                              A new verification link has been sent to your email address.
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <Button disabled={processing} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                          Save Changes
                        </Button>
                      </div>
                    </>
                  )}
                </Form>

                {/* Delete User Section */}
                <div className="border-t border-gray-200 pt-8">
                  <DeleteUser />
                </div>
              </div>
            </Tabs.Content>

            {/* Security Tab */}
            <Tabs.Content value="security" className={tabClasses.content}>
              <div className="space-y-8">
                {/* Password Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Password</h2>
                  <p className="text-gray-600 mb-6">Ensure your account is using a long, random password to stay secure</p>

                  <Form
                    {...SecurityController.update.form()}
                    options={{
                      preserveScroll: true,
                    }}
                    resetOnError={['password', 'password_confirmation', 'current_password']}
                    resetOnSuccess
                    onError={(errors) => {
                      if (errors.password) {
                        passwordInput.current?.focus();
                      }
                      if (errors.current_password) {
                        currentPasswordInput.current?.focus();
                      }
                    }}
                    className="space-y-6"
                  >
                    {({ errors, processing }) => (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="current_password">Current Password</Label>
                          <PasswordInput
                            id="current_password"
                            ref={currentPasswordInput}
                            name="current_password"
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                            autoComplete="current-password"
                            placeholder="Current password"
                          />
                          <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="password">New Password</Label>
                          <PasswordInput
                            id="password"
                            ref={passwordInput}
                            name="password"
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                            autoComplete="new-password"
                            placeholder="New password"
                            passwordrules={props.passwordRules}
                          />
                          <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="password_confirmation">Confirm Password</Label>
                          <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                            autoComplete="new-password"
                            placeholder="Confirm password"
                            passwordrules={props.passwordRules}
                          />
                          <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                          <Button disabled={processing} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Update Password
                          </Button>
                        </div>
                      </>
                    )}
                  </Form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-t border-gray-200 pt-8">
                  <ManageTwoFactor
                    canManageTwoFactor={props.canManageTwoFactor}
                    requiresConfirmation={props.requiresConfirmation}
                    twoFactorEnabled={props.twoFactorEnabled}
                  />
                </div>

                {/* Passkeys */}
                <div className="border-t border-gray-200 pt-8">
                  <ManagePasskeys canManagePasskeys={props.canManagePasskeys} passkeys={props.passkeys} />
                </div>
              </div>
            </Tabs.Content>

            {/* Appearance Tab */}
            <Tabs.Content value="appearance" className={tabClasses.content}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Appearance Settings</h2>
                  <p className="text-gray-600">Update the appearance settings for your account</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <AppearanceTabs />
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </ErrorBoundary>
  );
}
