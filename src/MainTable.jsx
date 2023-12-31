import { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import CustomModal from "./Modal";
import "./MainTable.css";

Modal.setAppElement("#root");

function MainTable({ records, setRecords, filterOption }) {
  // Extrair a data atual para o input de data
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isFormIncomplete, setIsFormIncomplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingRecord, setEditingRecord] = useState({
    name: "",
    type: "entrada",
    value: "",
    date: getCurrentDate(),
  });

  // Filtro de registros
  const filteredRecords =
    filterOption === "entrada"
      ? records.filter((record) => record.type === "entrada")
      : filterOption === "saída"
      ? records.filter((record) => record.type === "saída")
      : records;

  // Validação do form
  const isFormValid = useCallback(() => {
    return (
      editingRecord.name.trim() !== "" &&
      editingRecord.type.trim() !== "" &&
      editingRecord.value.trim() !== "" &&
      editingRecord.date.trim() !== ""
    );
  }, [
    editingRecord.date,
    editingRecord.name,
    editingRecord.type,
    editingRecord.value,
  ]);

  const closeModal = () => setIsModalOpen(false);

  // Validação modal
  useEffect(() => {
    if (isButtonClicked) {
      setIsFormIncomplete(!isFormValid());
    }
  }, [editingRecord, isButtonClicked, isFormValid]);

  // Post de registros
  const handleAddRecord = () => {
    setIsButtonClicked(true);
    if (isFormValid() && !isModalOpen) {
      const updatedRecords =
        editingIndex === -1
          ? [...records, { ...editingRecord }]
          : records.map((record, index) =>
              index === editingIndex ? { ...editingRecord } : record
            );
      setRecords(updatedRecords);
      localStorage.setItem("records", JSON.stringify(updatedRecords));
      clearFields();
      setEditingIndex(-1);
    } else {
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsButtonClicked(false);
        setIsFormIncomplete(false);
      }, 5000);
    }
  };

  // Limpeza dos campos após registros
  const clearFields = () => {
    setEditingRecord({
      name: "",
      type: "entrada",
      value: "",
      date: getCurrentDate(),
    });
    setEditingIndex(-1);
  };

  // Edição de registros
  const handleEditRecord = (index) => {
    const recordToEdit = records[index];
    setEditingRecord({ ...recordToEdit });
    setEditingIndex(index);
  };

  // Exclusão de registros
  const handleDeleteRecord = (index) => {
    const updatedRecords = [...records];
    updatedRecords.splice(index, 1);
    setRecords(updatedRecords);
    localStorage.setItem("records", JSON.stringify(updatedRecords));
  };

  // Configuração do "Enter"
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddRecord();
    }
  };

  // Formatação da data
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  // Atualização dos registros
  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("records") || "[]");
    setRecords(storedRecords);
  }, [setRecords]);

  return (
    <div className="main-table">
      <div className="record-form">
        {/* Nome do registro */}
        <input
          type="text"
          placeholder="Digite o registro"
          value={editingRecord.name}
          maxLength={20}
          onChange={(e) =>
            setEditingRecord({ ...editingRecord, name: e.target.value })
          }
          onKeyPress={handleEnterKeyPress}
        />
        {/* Tipo do registro */}
        <select
          value={editingRecord.type}
          onChange={(e) =>
            setEditingRecord({ ...editingRecord, type: e.target.value })
          }
          onKeyPress={handleEnterKeyPress}
        >
          <option value="entrada">Entrada</option>
          <option value="saída">Saída</option>
        </select>
        {/* Valor */}
        <input
          type="number"
          placeholder="Digite o valor"
          value={editingRecord.value}
          onChange={(e) =>
            setEditingRecord({ ...editingRecord, value: e.target.value })
          }
          onKeyPress={handleEnterKeyPress}
        />
        {/* Data */}
        <input
          type="date"
          value={editingRecord.date}
          onChange={(e) =>
            setEditingRecord({ ...editingRecord, date: e.target.value })
          }
          onKeyPress={handleEnterKeyPress}
        />
        <button onClick={handleAddRecord} disabled={isFormIncomplete}>
          Adicionar
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CustomModal isOpen={isModalOpen} onRequestClose={closeModal}>
          <p>Por favor, preencha todos os campos!</p>
        </CustomModal>
      )}

      {/* Tabela */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="5">Inclua seus registros no formulário acima!</td>
              </tr>
            ) : (
              filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.name}</td>
                  <td>{record.type}</td>
                  <td>R$ {parseFloat(record.value).toFixed(2)}</td>
                  <td className="dateInput">{formatDate(record.date)}</td>
                  <td>
                    <button onClick={() => handleEditRecord(index)}>
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button onClick={() => handleDeleteRecord(index)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Prop-Types
MainTable.propTypes = {
  records: PropTypes.array.isRequired,
  setRecords: PropTypes.func.isRequired,
  filterOption: PropTypes.string.isRequired,
};

export default MainTable;
