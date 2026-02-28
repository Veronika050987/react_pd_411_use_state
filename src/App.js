import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import Question from './components/Question.js';
import Final from './components/Final.js';

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

const shuffleVariants = (variants, correctIndex) => {
    const indexedVariants = variants.map((text, index) => ({ text, originalIndex: index }));
    const shuffledIndexedVariants = shuffleArray([...indexedVariants]);
    
    const newVariants = shuffledIndexedVariants.map(item => item.text);
    const newCorrectIndex = shuffledIndexedVariants.findIndex(item => item.originalIndex === correctIndex);
    
    return { newVariants, newCorrectIndex };
};

const questions =
[
  {
    title:    "Какой язык программирования самый быстрый?",
    variants: ["C", "C++", "Assembler", "C#", "Python"],
    correct:  2
  },
  {
    title:    "Какой язык является чисто процедурным?",
    variants: ["C", "C++", "C#", "Java"],
    correct:  0
  },
  {
    title:    "Что такое функция?",
    variants: 
    [
      "Именованная область памяти, содержимое которой может изменяться во время выполнения программы",
      "Именованная область памяти, содержимое которой НЕ может изменяться во время выполнения программы",
      "Именованная область кода, которую можно вызывать при необходимости"
    ],
    correct:  2
  },
  {
    title:    "Что такое переменная?",
    variants: 
    [
      "Именованная область памяти, содержимое которой может изменяться во время выполнения программы",
      "Именованная область памяти, содержимое которой НЕ может изменяться во время выполнения программы",
      "Именованная область кода, которую можно вызывать при необходимости"
    ],
    correct:  0
  },
  {
    title:    "Что такое метод?",
    variants: ["Переменная внутри класса", "Функция внутри класса", "Реализация алгоритма"],
    correct:  1
  },
  {
    title:    "Какая структура данных обеспечивает добавление/удаление элементов за константное время?",
    variants: ["Массив", "Список", "Дерево"],
    correct:  1
  },
  {
    title:    "Какая структура данных обеспечивает доступ к элементам за константное время?",
    variants: ["Массив", "Список", "Дерево"],
    correct:  0
  },
]


function App() {
  const totalQuestions = questions.length;
  const [step,setStep] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null); 
  const [isAnswered, setIsAnswered] = useState(false);
  // 1. Состояние для хранения массива вопросов, перемешанного один раз
    const [shuffledOriginalQuestions, setShuffledOriginalQuestions] = useState([]);
    
    // 2. Состояние для хранения *текущего* вопроса с перемешанными вариантами
    const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
      // Глубокая копия массива перед шаффлингом, чтобы не портить исходный массив
      setShuffledOriginalQuestions(shuffleArray([...questions])); 
  }, []);

  // Хук для подготовки текущего вопроса (шаффлинг вариантов) при смене шага
    useEffect(() => {
        if (step < totalQuestions && shuffledOriginalQuestions.length > 0) {
            const original = shuffledOriginalQuestions[step];
            const { newVariants, newCorrectIndex } = shuffleVariants(original.variants, original.correct);
            
            setCurrentQuestion({
                ...original,
                variants: newVariants,
                correct: newCorrectIndex // Правильный ответ теперь находится по этому индексу в перемешанном массиве
            });
        }
    }, [step, shuffledOriginalQuestions, totalQuestions]);


    // Ранний возврат, если вопросы еще не готовы
    if (shuffledOriginalQuestions.length === 0 && step < totalQuestions) {
        return <div className="main">Загрузка вопросов...</div>;
    }
    
    if (step < totalQuestions && !currentQuestion) {
         // Эта ситуация может произойти на первую отрисовку, пока useEffect не сработал
         return <div className="main">Подготовка вопроса...</div>;
    }
    // --- Рендеринг ---
    
    const handleAnswer = (clickedIndex, isCorrect) => {
        if (isAnswered) return;
        
        setIsAnswered(true);
        setSelectedVariant(clickedIndex);

        if (isCorrect) {
            setCorrect(prev => prev + 1);
        }

        setTimeout(() => {
            setStep(prevStep => prevStep + 1);
            setIsAnswered(false);
            setSelectedVariant(null);
        }, 3500); 
    };
  return (
    <div className="main">
      {
      step < totalQuestions ?
      <Question 
      question={currentQuestion} 
      onAnswer={handleAnswer} 
      step={step} 
      totalQuestions={totalQuestions}
      selectedVariant={selectedVariant} // Передаем выбранный индекс
      isAnswered={isAnswered} // Передаем флаг, что ответ уже дан
      />
      : <Final totalQuestions={totalQuestions} correctAnswers={correct}/>
      }
      {/* <h4 style={{display:"flex", justifyContent:"space-between"}}><div>Всего вопросов: </div>    <div>{step}</div></h4>
      <h4 style={{display:"flex", justifyContent:"space-between"}}><div>Правильных ответов:</div> <div>{correct}</div></h4> */}
    </div>
  );
}

export default App;
