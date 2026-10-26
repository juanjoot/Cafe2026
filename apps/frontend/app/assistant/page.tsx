import AssistantForm from '@/components/AssistantForm';

export default function AssistantPage() {
  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-4">Asistente Virtual</h2>
      <p className="mb-4">
        Responde unas preguntas y te ayudaremos a elegir tu café ideal.
      </p>
      <AssistantForm />
    </section>
  );
}
