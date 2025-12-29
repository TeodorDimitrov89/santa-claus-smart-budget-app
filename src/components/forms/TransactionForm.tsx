import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, type TransactionInput } from '../../lib/validation';
import { CATEGORIES, MAX_DESCRIPTION_LENGTH } from '../../lib/constants';
import { useState } from 'react';

interface TransactionFormProps {
  onSubmit: (data: TransactionInput) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TransactionForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TransactionFormProps) => {
  const [descriptionLength, setDescriptionLength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    mode: 'onChange', // Real-time validation
    defaultValues: {
      description: '',
    },
  });

  const handleFormSubmit = async (data: TransactionInput) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Amount Field */}
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Amount <span className="text-christmas-red">*</span>
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-christmas-red transition-colors ${
            errors.amount ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-christmas-red text-sm mt-1">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Type Field */}
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Type <span className="text-christmas-red">*</span>
        </label>
        <select
          id="type"
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-christmas-red transition-colors ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('type')}
          defaultValue=""
        >
          <option value="" disabled>
            Select Type
          </option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        {errors.type && (
          <p className="text-christmas-red text-sm mt-1">
            {errors.type.message}
          </p>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Category <span className="text-christmas-red">*</span>
        </label>
        <select
          id="category"
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-christmas-red transition-colors ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('category')}
          defaultValue=""
        >
          <option value="" disabled>
            Select Category
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-christmas-red text-sm mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Date Field */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Date <span className="text-christmas-red">*</span>
        </label>
        <input
          id="date"
          type="date"
          max={new Date().toISOString().split('T')[0]}
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-christmas-red transition-colors ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('date', {
            valueAsDate: true,
          })}
        />
        {errors.date && (
          <p className="text-christmas-red text-sm mt-1">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Add details about this transaction..."
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-christmas-red transition-colors resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('description', {
            onChange: (e) => setDescriptionLength(e.target.value.length),
          })}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && (
            <p className="text-christmas-red text-sm">
              {errors.description.message}
            </p>
          )}
          <p
            className={`text-sm ml-auto ${
              descriptionLength > MAX_DESCRIPTION_LENGTH
                ? 'text-christmas-red'
                : 'text-gray-500'
            }`}
          >
            {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex-1 festive-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
};
