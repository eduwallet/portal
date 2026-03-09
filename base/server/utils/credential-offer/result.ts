import { fetchCourses } from '../../api/courses/index.get';
import { CreateOfferResponse, CreateOfferBackendResponse, makeId } from '.'
import { toExam } from '../courses/mapper';

interface ResultCredentialOfferBody {
    agentPrefix: string;
    title: string;
    code: string;
    eduId: string;
    programId: string;
    institutionId: string;
    outcome: string;
    language: string;
    criteria: string;
    eqf: number;
    participation: string;
    quality: string;
}

export const createResultCredentialOffer = async (body: ResultCredentialOfferBody, event: any): Promise<CreateOfferResponse> => {
    const {
        agentPrefix,
        title,
        code,
        eduId,
        programId,
        language,
        criteria,
        eqf,
        participation,
        quality,
    } = body;

    if (!agentPrefix || !title || !code || !eduId) {
        throw new Error('Fields agentPrefix, title, code and eduId are required');
    }

    const courses = await fetchCourses();
    const exam = courses.map(toExam).find(e => e.code === code);

    const config = useRuntimeConfig();

    const imageBaseUrl = process.env.NUXT_PUBLIC_IMAGE_BASE_URL || '';
    const issuerToken = process.env.NUXT_ISSUER_TOKEN || '';
    const agentBaseUrl = process.env.NUXT_PUBLIC_AGENT_BASE_URL || '';
    const appName = config.public.appName as string;
    const shortCode = appName.split('-')[1];

    const response: CreateOfferBackendResponse = await $fetch(`${agentBaseUrl}/${agentPrefix}/api/create-offer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${issuerToken}`,
        },
        body: {
            credentials: ['OpenBadgeCredential'],
            grants: {
                'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
                    'pre-authorized_code': makeId(16),
                },
            },
            credentialDataSupplierInput: {
                achievement: {
                    id: `https://example.com/achievements/ach-${code}`,
                    type: [
                        'Achievement',
                        'EducredentialAchievement'
                    ],
                    criteria: {
                        narrative: criteria || '',
                    },
                    description: exam?.outcome,
                    name: title,
                    image: {
                        id: `${imageBaseUrl}/images/${shortCode}/microcredentials/${code.toLowerCase()}.png`,
                        type: 'Image',
                    },
                    inLanguage: language,
                    educationProgramIdentifier: programId,
                    ECTS: eqf,
                    alignment: [
                        {
                            type: [
                                'Alignment'
                            ],
                            targetType: 'ext:QualityAssurance',
                            targetName: exam?.name,
                            targetDescription: quality,
                            targetCode: `AV-${code}`,
                            targetUrl: `https://data.example.com/decisions/AV-${code}`
                        },
                        {
                            type: [
                                'Alignment'
                            ],
                            targetType: 'ext:EQF',
                            targetName: 'EQF level 4',
                            targetCode: '4',
                            targetUrl: 'https://content.example.com/description-eqf-levels'
                        }
                    ],
                    participationType: participation,
                    assessmentType: 'testing',
                    identityChecked: true,
                    supervisionType: 'online',
                    resultDescription: [
                        {
                            id: `https://example.com/results/ects-${language}-${code}`,
                            type: [
                                'ResultDescription'
                            ],
                            valueMax: '10',
                            valueMin: '1',
                            name: 'Final Project Grade',
                            requiredValue: '6',
                            resultType: 'ext:ECTSGradeScore'
                        }
                    ]
                },
                result: [
                    {
                        type: [
                            'Result'
                        ],
                        resultDescription: `https://example.com/results/ects-${language}-${code}`,
                        value: '10',
                    },
                ],
            },
            credentialMetadata: code.toLowerCase() === '11br.002.01' ? {
                evidence: [
                    {
                        "id": "/videos/tim.webm",
                        "type": ["Evidence"],
                        "name": "Dance workshop",
                        "description": "Me giving a dance workshop.",
                        "digestMultibase": "uELq9FnJ5YLa5iAszyJ518bXcnlc5P7xp1u-5uJRDYKvc"
                    },
                ],
            } : {},
        }
    });

    return {
        qr_id: String(response.id),
        qr_uri: response.uri,
        pin: String(response.txCode),
    }
};
