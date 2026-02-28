import './Question.css';
import ProgressBar from './ProgressBar';

function Question({question, onClickVariant, step, totalQuestions})
{
    const percentage = Math.round(step/totalQuestions*100)
    return(
        <div className='question'>
            <ProgressBar percentage={percentage} />
            <h3>{question.title}</h3>
            <ul>
                {
                    question.variants.map
                    (
                        (text, index) =>
                            <li key={index} onClick={()=>onClickVariant(index)}>
                                {text}
                            </li>
                    )
                }
            </ul>
        </div>
    )
}
export default Question;
