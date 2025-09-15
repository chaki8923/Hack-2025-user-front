interface Step {
    id: number;
    instruction: string;
    step_number: number;
}

interface RecipeStepsProps {
    steps: Step[];
    cookingPoint: string;
}

export default function RecipeSteps({ steps, cookingPoint }: RecipeStepsProps) {
    return (
        <div className="self-stretch px-5 flex flex-col justify-start items-start gap-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="text-zinc-800 text-xl font-bold font-['Noto_Sans_JP'] leading-tight">手順</div>
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    {steps.map((step) => (
                        <div key={step.id} className="self-stretch inline-flex justify-start items-start gap-2">
                            <div className="w-6 h-6 bg-stone-700 rounded-full flex items-center justify-center text-white text-sm font-normal font-['Noto_Sans_JP'] leading-tight flex-shrink-0">
                                {step.step_number}
                            </div>
                            <div className="text-zinc-800 text-sm font-normal font-['Noto_Sans_JP'] leading-tight">{step.instruction}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4 mb-[28px]">
                <div className="text-zinc-800 text-xl font-bold font-['Noto_Sans_JP'] leading-tight">作る時のポイント</div>
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch inline-flex justify-start items-start gap-2">
                        <div className="text-zinc-800 text-sm font-normal font-['Noto_Sans_JP'] leading-tight">{cookingPoint}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}