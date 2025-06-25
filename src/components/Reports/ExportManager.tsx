import React, { useState } from 'react';
import { Download, Mail, Calendar, Users, Scissors, DollarSign, FileText, Settings, Clock, CheckCircle } from 'lucide-react';

interface ExportManagerProps {
  dateRange: { start: string; end: string };
  selectedProfessional: string;
  selectedService: string;
}

export function ExportManager({ dateRange, selectedProfessional, selectedService }: ExportManagerProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [scheduleExport, setScheduleExport] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const availableReports = [
    { id: 'revenue', name: 'Relatório de Faturamento', icon: DollarSign, description: 'Análise detalhada de receitas por período, serviço e profissional' },
    { id: 'services', name: 'Análise de Serviços', icon: Scissors, description: 'Métricas de desempenho dos serviços, incluindo volume e receita' },
    { id: 'professionals', name: 'Ranking de Profissionais', icon: Users, description: 'Comparativo de performance entre profissionais' },
    { id: 'occupancy', name: 'Métricas de Ocupação', icon: Clock, description: 'Análise de ocupação, tempo ocioso e cancelamentos' },
    { id: 'heatmap', name: 'Mapa de Calor', icon: Calendar, description: 'Visualização de horários mais movimentados' },
    { id: 'clients', name: 'Análise de Clientes', icon: Users, description: 'Perfil de clientes, frequência e ticket médio' },
    { id: 'financial', name: 'Relatório Financeiro', icon: DollarSign, description: 'DRE, fluxo de caixa e análise de custos' },
  ];

  const toggleReportSelection = (reportId: string) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };

  const handleExport = () => {
    if (selectedReports.length === 0) return;
    
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Report Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Selecione os Relatórios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableReports.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                onClick={() => toggleReportSelection(report.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedReports.includes(report.id)
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedReports.includes(report.id)
                      ? 'bg-amber-100'
                      : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      selectedReports.includes(report.id)
                        ? 'text-amber-600'
                        : 'text-slate-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{report.name}</p>
                    <p className="text-sm text-slate-600">{report.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Opções de Exportação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format Selection */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Formato</h4>
            <div className="flex space-x-4">
              <label className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                exportFormat === 'pdf'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={() => setExportFormat('pdf')}
                  className="sr-only"
                />
                <FileText className={`w-8 h-8 mb-2 ${exportFormat === 'pdf' ? 'text-amber-600' : 'text-slate-600'}`} />
                <span className="font-medium text-slate-900">PDF</span>
                <span className="text-xs text-slate-600 mt-1">Relatório formatado</span>
              </label>
              
              <label className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                exportFormat === 'excel'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={() => setExportFormat('excel')}
                  className="sr-only"
                />
                <FileText className={`w-8 h-8 mb-2 ${exportFormat === 'excel' ? 'text-amber-600' : 'text-slate-600'}`} />
                <span className="font-medium text-slate-900">Excel</span>
                <span className="text-xs text-slate-600 mt-1">Planilha dinâmica</span>
              </label>
              
              <label className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                exportFormat === 'csv'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                  className="sr-only"
                />
                <FileText className={`w-8 h-8 mb-2 ${exportFormat === 'csv' ? 'text-amber-600' : 'text-slate-600'}`} />
                <span className="font-medium text-slate-900">CSV</span>
                <span className="text-xs text-slate-600 mt-1">Dados brutos</span>
              </label>
            </div>
          </div>

          {/* Delivery Options */}
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Entrega</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="schedule-export"
                  checked={scheduleExport}
                  onChange={(e) => setScheduleExport(e.target.checked)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="schedule-export" className="text-slate-900">
                  Agendar envio automático
                </label>
              </div>
              
              {scheduleExport && (
                <div className="pl-7 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Frequência
                    </label>
                    <select
                      value={scheduleFrequency}
                      onChange={(e) => setScheduleFrequency(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Destinatários (separados por vírgula)
                    </label>
                    <input
                      type="text"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      placeholder="email@exemplo.com, outro@exemplo.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Personalização</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Opções de Relatório</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  defaultChecked
                />
                <span className="text-slate-900">Incluir gráficos e visualizações</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  defaultChecked
                />
                <span className="text-slate-900">Incluir tabelas de dados</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  defaultChecked
                />
                <span className="text-slate-900">Incluir análises e recomendações</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  defaultChecked
                />
                <span className="text-slate-900">Incluir comparativo com período anterior</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 mb-3">Aparência</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  defaultChecked
                />
                <span className="text-slate-900">Incluir logo da barbearia</span>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Esquema de Cores
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  defaultValue="amber"
                >
                  <option value="amber">Âmbar (Padrão)</option>
                  <option value="blue">Azul</option>
                  <option value="green">Verde</option>
                  <option value="purple">Roxo</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Formato de Página
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  defaultValue="a4"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Carta</option>
                  <option value="legal">Ofício</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Pronto para Exportar</h3>
            <p className="text-slate-600 mt-1">
              {selectedReports.length} {selectedReports.length === 1 ? 'relatório selecionado' : 'relatórios selecionados'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {scheduleExport ? (
              <button
                onClick={handleExport}
                disabled={selectedReports.length === 0 || isExporting || !emailRecipients}
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {isExporting ? 'Agendando...' : 'Agendar Envio'}
              </button>
            ) : (
              <button
                onClick={handleExport}
                disabled={selectedReports.length === 0 || isExporting}
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5 mr-2" />
                {isExporting ? 'Exportando...' : 'Exportar Agora'}
              </button>
            )}
            
            <button
              onClick={() => setSelectedReports([])}
              disabled={selectedReports.length === 0 || isExporting}
              className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpar Seleção
            </button>
          </div>
        </div>
        
        {exportSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">
              {scheduleExport 
                ? 'Envio agendado com sucesso! Os relatórios serão enviados conforme programado.' 
                : 'Relatórios exportados com sucesso!'}
            </span>
          </div>
        )}
      </div>

      {/* Recent Exports */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Exportações Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Data</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Relatórios</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Formato</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Usuário</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-slate-900">15/06/2024 14:32</td>
                <td className="py-3 px-4 text-slate-900">Faturamento, Serviços</td>
                <td className="py-3 px-4 text-slate-900">PDF</td>
                <td className="py-3 px-4 text-slate-900">Admin</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Download
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-slate-900">10/06/2024 09:15</td>
                <td className="py-3 px-4 text-slate-900">Ranking de Profissionais</td>
                <td className="py-3 px-4 text-slate-900">Excel</td>
                <td className="py-3 px-4 text-slate-900">Admin</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Download
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-slate-900">01/06/2024 18:05</td>
                <td className="py-3 px-4 text-slate-900">Relatório Completo</td>
                <td className="py-3 px-4 text-slate-900">PDF</td>
                <td className="py-3 px-4 text-slate-900">Admin</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}