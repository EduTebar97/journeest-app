
import React from 'react';
import { Question, Answer } from '../../types';
import { ListItem } from './DynamicListInput';
import TextAreaInput from './TextAreaInput';
import SliderInput from './SliderInput';
import DynamicListInput from './DynamicListInput';
import MultipleChoiceInput from './MultipleChoiceInput';
import CheckboxGroupInput from './CheckboxGroupInput';

interface QuestionRendererProps {
  question: Question;
  currentAnswer: Answer;
  onAnswerChange: (questionId: string, answer: Answer) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, currentAnswer, onAnswerChange }) => {
  const { id, type, label, description, options } = question;

  switch (type) {
    case 'text_area':
      return (
        <TextAreaInput
          id={id}
          label={label}
          description={description}
          value={typeof currentAnswer === 'string' ? currentAnswer : ''}
          onChange={(val) => onAnswerChange(id, val)}
        />
      );
    
    case 'slider':
      return (
        <SliderInput
          id={id}
          label={label}
          description={description}
          value={typeof currentAnswer === 'number' ? currentAnswer : (question.min ?? 0)}
          onChange={(val) => onAnswerChange(id, val)}
          min={question.min}
          max={question.max}
        />
      );

    case 'dynamic_list':
      const items = Array.isArray(currentAnswer) ? currentAnswer as ListItem[] : [];
      return (
        <DynamicListInput
          id={id}
          label={label}
          description={description}
          items={items}
          onChange={(newItems) => onAnswerChange(id, newItems)}
        />
      );
      
    case 'multiple_choice':
      return (
        <MultipleChoiceInput
          id={id}
          label={label}
          description={description}
          options={options || []}
          value={typeof currentAnswer === 'string' ? currentAnswer : ''}
          onChange={(val) => onAnswerChange(id, val)}
        />
      );
      
    case 'checkboxes':
      const values = Array.isArray(currentAnswer) ? currentAnswer as string[] : [];
      return (
        <CheckboxGroupInput
          id={id}
          label={label}
          description={description}
          options={options || []}
          value={values}
          onChange={(newValues) => onAnswerChange(id, newValues)}
        />
      );
    
    // case 'text_input': still to be implemented if needed
      
    default:
      return (
        <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
          <p><strong>{label}</strong></p>
          <p><em>Tipo de pregunta '{type}' aún no implementado.</em></p>
        </div>
      );
  }
};

export default QuestionRenderer;
