// utils/profileCompletion.js

type ProfileData = Record<string, unknown>;

interface ProfileField {
    key: string;
    label: string;
    weight: number;
    validate?: (value: unknown, user?: ProfileData) => boolean;
}

/** Schéma des champs attendus + poids (modifiable à volonté) */
export const PROFILE_SCHEMA: ProfileField[] = [
    {
        key: 'name',
        label: 'Nom',
        weight: 10,
        validate: (v: unknown) => !!v && String(v).trim().length >= 2,
    },
    {
        key: 'email',
        label: 'Email',
        weight: 10,
        validate: (v: unknown) => /\S+@\S+\.\S+/.test(String(v || '')),
    },
    {
        key: 'phone',
        label: 'Téléphone',
        weight: 10,
        validate: (v: unknown) => !!v && String(v).trim().length >= 6,
    },
    {
        key: 'profile_photo',
        label: 'Photo de profil',
        weight: 10,
        validate: (v: unknown) => !!v,
    }, // url/ID/fichier
    {
        key: 'address',
        label: 'Adresse',
        weight: 8,
        validate: (v: unknown) => !!v && String(v).trim().length >= 5,
    },
    {
        key: 'bio',
        label: 'Bio',
        weight: 5,
        validate: (v: unknown) => !!v && String(v).trim().length >= 10,
    },
    // { key: 'username',           label: 'Nom d’utilisateur', weight: 5,  validate: v => !!v && String(v).trim().length >= 3 },
];

/** Accès sûr aux clés, y compris `profile.avatarUrl` si tu veux des chemins profonds */
function safeGet(obj: ProfileData, path: string): unknown {
    if (!obj || !path) return undefined;
    const parts = String(path).split('.');
    let cur: unknown = obj;
    for (const p of parts) {
        if (typeof cur !== 'object' || cur === null) return undefined;
        cur = (cur as ProfileData)[p];
    }
    return cur;
}

/** Calcule { percent, missingLabels } à partir du user et du schéma */
export function computeProfileCompletion(
    user: ProfileData | null | undefined,
    schema: ProfileField[] = PROFILE_SCHEMA,
) {
    if (!user) return { percent: 0, missingLabels: schema.map((s) => s.label) };

    const total = schema.reduce((a, s) => a + s.weight, 0);
    let score = 0;
    const missingLabels: string[] = [];

    for (const field of schema) {
        const value = safeGet(user, field.key);
        const ok = field.validate ? field.validate(value, user) : !!value;
        if (ok) score += field.weight;
        else missingLabels.push(field.label);
    }

    const percent = Math.min(100, Math.round((score / total) * 100));
    return { percent, missingLabels };
}
