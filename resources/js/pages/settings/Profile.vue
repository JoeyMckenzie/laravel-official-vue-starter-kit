<script lang="ts" setup>
import type { BreadcrumbItem, SharedData } from "@/types";
import { Head, Link, router, useForm, usePage } from "@inertiajs/vue3";
import { computed, ref, useTemplateRef } from "vue";
import DeleteUser from "@/components/DeleteUser.vue";
import HeadingSmall from "@/components/HeadingSmall.vue";
import InputError from "@/components/InputError.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/AppLayout.vue";
import SettingsLayout from "@/layouts/settings/Layout.vue";

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
}

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Profile settings",
        href: "/settings/profile",
    },
];

const page = usePage<SharedData>();
const user = computed(() => page.props.auth.user as App.Data.UserData);
const profileImage = ref<string | null>(null);
const photoInput = useTemplateRef<HTMLInputElement>("photo-input");

const form = useForm<{
    _method: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: File | null;
}>({
    _method: "patch",
    first_name: user.value.firstName,
    last_name: user.value.lastName,
    email: user.value.email,
    profile_image: null,
});

function selectNewPhoto() {
    photoInput.value?.click();
}

function updatePhotoPreview() {
    const photo = photoInput.value?.files?.[0];

    if (!photo) {
        return;
    }

    form.profile_image = photo;
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
        profileImage.value = e.target?.result as string;
    };

    reader.readAsDataURL(photo);
}

function deletePhoto() {
    router.delete(route("profile-photo.destroy"), {
        preserveScroll: true,
        preserveState: false,
        onSuccess: () => {
            profileImage.value = null;
            clearPhotoFileInput();
        },
    });
}

function clearPhotoFileInput() {
    if (photoInput.value) {
        photoInput.value.value = "";
    }
}

function submit() {
    form.post(route("profile.update"), {
        preserveScroll: true,
        preserveState: false,
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Profile settings" />

        <SettingsLayout>
            <div class="flex flex-col space-y-6">
                <HeadingSmall description="Update your name and email address" title="Profile information" />

                <form class="space-y-6" @submit.prevent="submit">
                    <div class="grid gap-2">
                        <input
                            id="photo"
                            ref="photo-input"
                            accept="image/*"
                            class="hidden"
                            type="file"
                            @change="updatePhotoPreview"
                        >
                        <div class="flex items-center gap-4">
                            <Avatar class="h-20 w-20">
                                <AvatarImage
                                    :alt="user.fullName"
                                    :src="profileImage ?? user.profileImage ?? ''"
                                />
                                <AvatarFallback>
                                    {{ user.initials }}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                type="button"
                                variant="outline"
                                @click="selectNewPhoto"
                            >
                                Select photo
                            </Button>
                            <Button
                                v-if="user.profileImage"
                                type="button"
                                variant="outline"
                                @click="deletePhoto"
                            >
                                Remove photo
                            </Button>
                        </div>
                        <InputError
                            :message="form.errors.profile_image"
                            class="mt-2"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div class="grid gap-2">
                            <Label for="first_name">First name</Label>
                            <Input
                                id="first_name"
                                v-model="form.first_name"
                                autocomplete="first_name"
                                class="mt-1 block w-full"
                                placeholder="First name"
                                required
                            />
                            <InputError :message="form.errors.first_name" class="mt-2" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="last_name">Last name</Label>
                            <Input
                                id="name"
                                v-model="form.last_name"
                                autocomplete="last_name"
                                class="mt-1 block w-full"
                                placeholder="Last name"
                                required
                            />
                            <InputError :message="form.errors.last_name" class="mt-2" />
                        </div>
                    </div>

                    <div class="grid gap-2">
                        <Label for="email">Email address</Label>
                        <Input
                            id="email"
                            v-model="form.email"
                            autocomplete="username"
                            class="mt-1 block w-full"
                            placeholder="Email address"
                            required
                            type="email"
                        />
                        <InputError :message="form.errors.email" class="mt-2" />
                    </div>

                    <div v-if="mustVerifyEmail && !user.emailVerifiedAt">
                        <p class="text-muted-foreground -mt-4 text-sm">
                            Your email address is unverified.
                            <Link
                                :href="route('verification.send')"
                                as="button"
                                class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                method="post"
                            >
                                Click here to resend the verification email.
                            </Link>
                        </p>

                        <div v-if="status === 'verification-link-sent'" class="mt-2 text-sm font-medium text-green-600">
                            A new verification link has been sent to your email address.
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <Button :disabled="form.processing">
                            Save
                        </Button>

                        <Transition
                            enter-active-class="transition ease-in-out"
                            enter-from-class="opacity-0"
                            leave-active-class="transition ease-in-out"
                            leave-to-class="opacity-0"
                        >
                            <p v-show="form.recentlySuccessful" class="text-sm text-neutral-600">
                                Saved.
                            </p>
                        </Transition>
                    </div>
                </form>
            </div>

            <DeleteUser />
        </SettingsLayout>
    </AppLayout>
</template>
