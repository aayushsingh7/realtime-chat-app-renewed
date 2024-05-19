const copyToClipboard = (formattedDate: string) => {
  const textarea = document.createElement("textarea");

  textarea.value = formattedDate;

  document.body.appendChild(textarea);

  textarea.select();

  document.execCommand("copy");

  document.body.removeChild(textarea);
};

export default copyToClipboard;
