export const STANDARD_THRESHOLDS = [
    {
        label: 'Severely Underweight',
        min: 0, max: 16,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        gaugeColor: 'var(--blue)',
        advice: 'Consult a doctor. Significant health risks associated with very low body weight.'
    },
    {
        label: 'Underweight',
        min: 16, max: 18.5,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/30',
        gaugeColor: 'var(--ocean-blue)',
        advice: 'Below healthy range. Consider increasing caloric intake with nutrient-dense foods.'
    },
    {
        label: 'Normal',
        min: 18.5, max: 25,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        gaugeColor: 'var(--success)',
        advice: 'Healthy weight range. Maintain with balanced diet and regular physical activity.'
    },
    {
        label: 'Overweight',
        min: 25, max: 30,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        gaugeColor: 'var(--warn)',
        advice: 'Slightly above healthy range. Regular exercise and mindful eating can help.'
    },
    {
        label: 'Obese Class I',
        min: 30, max: 35,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        gaugeColor: 'var(--error)',
        advice: 'Increased health risk. Lifestyle changes and medical consultation recommended.'
    },
    {
        label: 'Obese Class II',
        min: 35, max: 40,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        gaugeColor: 'var(--error)',
        advice: 'High health risk. Medical supervision strongly recommended.'
    },
    {
        label: 'Obese Class III',
        min: 40, max: Infinity,
        color: 'text-red-600',
        bgColor: 'bg-red-600/10',
        borderColor: 'border-red-600/30',
        gaugeColor: 'var(--error)',
        advice: 'Very high health risk. Please consult a healthcare professional immediately.'
    },
];
export const ASIAN_THRESHOLDS = [
    { label: 'Underweight', min: 0, max: 18.5 },
    { label: 'Normal', min: 18.5, max: 23 },
    { label: 'Overweight', min: 23, max: 27.5 },
    { label: 'Obese Class I', min: 27.5, max: Infinity },
];
