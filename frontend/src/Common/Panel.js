const Panel = ({ title, children }) => {
  return (
    <div class="mx-auto max-w-[60rem] border border-gray-200 rounded-md shadow p-6 mb-6 bg-white">
      <div class="bg-gray-100 border-b border-gray-200 px-4 py-2 font-semibold text-gray-700 rounded-t-md">
        {title || 'Panel Heading'}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Panel;
