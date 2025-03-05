import { useConversation } from '../context/conversationContext';
import Input from './input';
import car from '../assets/icons/car.svg';
import gift from '../assets/icons/gift.svg';
import money_sack from '../assets/icons/money_sack.svg';
import info from '../assets/icons/info.svg';

export default function Welcome() {
    const conversationContext = useConversation();
    return (
        <div className="flex h-full w-4/5 flex-col items-center justify-center bg-neutral-200 px-5 py-3">
            <div className="flex h-full w-4/5 flex-col items-center justify-center bg-neutral-200 px-5 py-3">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-bold">
                        Bem-vindo à Renova IA
                    </h1>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="flex flex-col items-center rounded-lg bg-neutral-300 p-4 text-left hover:bg-neutral-100"
                            onClick={() =>
                                conversationContext.createConversationAndAddMessageToIt(
                                    'tipo de veículo carro. Quero trocar de carro',
                                )
                            }
                        >
                            <img className='h-5 w-5' src={gift} alt="gift icon" />
                            Quero trocar de carro
                        </button>
                        <button
                            className="flex flex-col items-center rounded-lg bg-neutral-300 p-4 text-left hover:bg-neutral-100"
                            onClick={() =>
                                conversationContext.createConversationAndAddMessageToIt(
                                    'tipo de veículo carro. Quero saber o valor do meu carro',
                                )
                            }
                        >
                            <img className='h-5 w-5' src={car} alt="car icon" />
                            Quero saber o valor do meu carro
                        </button>
                        <button
                            className="flex flex-col items-center rounded-lg bg-neutral-300 p-4 text-left hover:bg-neutral-100"
                            onClick={() =>
                                conversationContext.createConversationAndAddMessageToIt(
                                    'tipo de veículo carro. marca 23 chevrolet. modelo código 8823. ano 2025. Quanto custa esse Onix do ano 2025?',
                                )
                            }
                        >
                            <img className='h-5 w-5' src={money_sack} alt="money sack icon" />
                            Quanto custa um Onix 2025?
                        </button>
                        <button
                            className="flex flex-col items-center rounded-lg bg-neutral-300 p-4 text-left hover:bg-neutral-100"
                            onClick={() =>
                                conversationContext.createConversationAndAddMessageToIt(
                                    'Me fale pra que serve bem detalhadamente essa aplicação, quem criou essa aplicação, sua credibilidade e de onde vem os dados.',
                                )
                            }
                        >
                            <img className='h-5 w-5' src={info} alt="info icon" />
                            Sobre a Renova IA
                        </button>
                    </div>
                </div>
            </div>
            <Input />
        </div>
    );
}
