// Table rendering utilities
const Table = {
  // Render a table from data
  render(container, data, columns, actions = []) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    
    if (!container) return;
    
    if (!data || data.length === 0) {
      container.innerHTML = '<div class="empty-state">Нет данных</div>';
      return;
    }
    
    let html = '<table class="data-table"><thead><tr>';
    
    // Render headers
    columns.forEach(col => {
      html += `<th>${col.label}</th>`;
    });
    
    if (actions.length > 0) {
      html += '<th>Действия</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    // Render rows
    data.forEach(row => {
      html += '<tr>';
      
      columns.forEach(col => {
        const value = col.render ? col.render(row[col.key], row) : row[col.key];
        html += `<td>${value || '-'}</td>`;
      });
      
      // Render actions
      if (actions.length > 0) {
        html += '<td class="actions">';
        actions.forEach(action => {
          html += `<button class="btn btn-sm btn-${action.type || 'secondary'}" 
                    data-action="${action.name}" 
                    data-id="${row.id}">${action.label}</button>`;
        });
        html += '</td>';
      }
      
      html += '</tr>';
    });
    
    html += '</tbody></table>';
    
    container.innerHTML = html;
    
    // Attach action handlers
    if (actions.length > 0) {
      container.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const actionName = e.target.dataset.action;
          const itemId = e.target.dataset.id;
          const action = actions.find(a => a.name === actionName);
          
          if (action && action.handler) {
            action.handler(itemId, data.find(d => d.id === itemId));
          }
        });
      });
    }
  }
};

// Make Table globally available
window.Table = Table;
