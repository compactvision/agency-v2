import ErrorText from '@/components/ui/ErrorText';
import { type SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AtSign, MessageSquare, Phone, Send, User } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function ContactForm() {
    const { t } = useTranslation();
    const { flash } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('contact.send'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: () => {
                requestAnimationFrame(() => {
                    document
                        .querySelector<HTMLElement>('[aria-invalid="true"]')
                        ?.focus();
                });
            },
        });
    };

    return (
        <div className="rounded-2xl bg-white p-8 shadow-xl md:p-12 dark:border dark:border-zinc-800 dark:bg-zinc-900">
            {/* En-tête du formulaire */}
            <div className="mb-10 text-center">
                <span className="mb-4 inline-block rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    {t('contact_us')}
                </span>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-zinc-100">
                    {t('do_you_have_any_question')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-zinc-400">
                    {t('real_estate_support_message')}
                </p>
            </div>

            {/* Formulaire */}
            {flash?.success && (
                <div
                    role="status"
                    aria-live="polite"
                    className="mb-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 font-medium text-emerald-900"
                >
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div
                    role="alert"
                    className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 font-medium text-red-900"
                >
                    {flash.error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Champ Nom */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300"
                        >
                            {t('your_name')}
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <User
                                    size={20}
                                    className="text-gray-400 dark:text-zinc-500"
                                />
                            </div>
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                required
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={
                                    errors.name ? 'name-error' : undefined
                                }
                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                                placeholder={t('your_name')}
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                        </div>
                        <ErrorText id="name-error" error={errors.name} />
                    </div>

                    {/* Champ Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300"
                        >
                            {t('your_email')}
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <AtSign
                                    size={20}
                                    className="text-gray-400 dark:text-zinc-500"
                                />
                            </div>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email ? 'email-error' : undefined
                                }
                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                                placeholder={t('your_email')}
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                        </div>
                        <ErrorText id="email-error" error={errors.email} />
                    </div>

                    {/* Champ Téléphone */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300"
                        >
                            {t('phone_number')}
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Phone
                                    size={20}
                                    className="text-gray-400 dark:text-zinc-500"
                                />
                            </div>
                            <input
                                id="phone"
                                type="tel"
                                autoComplete="tel"
                                aria-invalid={Boolean(errors.phone)}
                                aria-describedby={
                                    errors.phone ? 'phone-error' : undefined
                                }
                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                                placeholder={t('phone_number')}
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                        </div>
                        <ErrorText id="phone-error" error={errors.phone} />
                    </div>

                    {/* Champ Sujet */}
                    <div>
                        <label
                            htmlFor="subject"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300"
                        >
                            {t('subject')}
                        </label>
                        <div className="relative">
                            <input
                                id="subject"
                                type="text"
                                required
                                aria-invalid={Boolean(errors.subject)}
                                aria-describedby={
                                    errors.subject ? 'subject-error' : undefined
                                }
                                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-4 transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                                placeholder={t('subject')}
                                value={data.subject}
                                onChange={(e) =>
                                    setData('subject', e.target.value)
                                }
                            />
                        </div>
                        <ErrorText id="subject-error" error={errors.subject} />
                    </div>
                </div>

                {/* Champ Message */}
                <div>
                    <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300"
                    >
                        {t('your_message')}
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute top-3 left-3">
                            <MessageSquare
                                size={20}
                                className="text-gray-400 dark:text-zinc-500"
                            />
                        </div>
                        <textarea
                            id="message"
                            rows={5}
                            required
                            minLength={10}
                            aria-invalid={Boolean(errors.message)}
                            aria-describedby={
                                errors.message ? 'message-error' : undefined
                            }
                            className="w-full resize-none rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-colors focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                            placeholder={t('your_message')}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                        ></textarea>
                    </div>
                    <ErrorText id="message-error" error={errors.message} />
                </div>

                {/* Bouton d'envoi */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={processing}
                        aria-busy={processing}
                    >
                        {processing ? (
                            <>
                                <svg
                                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                {t('sending')}...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                {t('submit_now')}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
