(function () {
  const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://barbearia-britos-back.vercel.app';
  var modal = document.getElementById('booking-modal');
  var form = document.getElementById('booking-wizard');
  if (!modal || !form) return;

  var serviceSelect = document.getElementById('booking-service');
  var serviceDetail = document.getElementById('booking-service-detail');
  var barberSelect = document.getElementById('booking-barber');
  var dateInput = document.getElementById('booking-date');
  var calendarTitle = document.getElementById('booking-calendar-title');
  var calendarDays = document.getElementById('booking-calendar-days');
  var calendarPrev = document.getElementById('booking-calendar-prev');
  var calendarNext = document.getElementById('booking-calendar-next');
  var slotsContainer = document.getElementById('booking-slots');
  var availabilityMessage = document.getElementById('booking-availability-message');
  var nameInput = document.getElementById('booking-name');
  var phoneInput = document.getElementById('booking-phone');
  var message = document.getElementById('booking-message');
  var success = document.getElementById('booking-success');
  var nextButton = document.getElementById('booking-next');
  var backButton = document.getElementById('booking-back');
  var submitButton = document.getElementById('booking-submit');
  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-booking-step]'));
  var indicators = Array.prototype.slice.call(document.querySelectorAll('[data-step-indicator]'));
  var selectedTime = '';
  var services = [];
  var barbers = [];
  // Mesmas chaves de barbers.days no banco, na ordem de Date.getDay().
  var weekdayKeys = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  var maxMonthsAhead = 2;
  var calendarMonth = null;
  var currentStep = 1;
  var availabilityRequest = 0;
  var barbersRequest = 0;
  var lastOpener = null;

  function showMessage(text, state) {
    message.textContent = text;
    message.dataset.state = state || '';
    message.hidden = !text;
  }

  async function requestJson(path, options) {
    var response;
    try {
      response = await fetch(`${API_BASE_URL}${path}`, options);
    } catch (error) {
      throw new Error('Não foi possível conectar ao servidor de agendamento. Verifique se ele está ativo e tente novamente.');
    }

    var data;
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('O servidor retornou uma resposta inválida. Tente novamente mais tarde.');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Não foi possível concluir o pedido. Tente novamente.');
    }

    return data;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  function setStep(step) {
    currentStep = step;
    steps.forEach(function (section) {
      section.hidden = Number(section.dataset.bookingStep) !== step;
    });
    indicators.forEach(function (indicator) {
      var index = Number(indicator.dataset.stepIndicator);
      if (index === step) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');
      indicator.dataset.complete = index < step ? 'true' : 'false';
    });
    if (step === 2) renderCalendar();
    backButton.hidden = step === 1;
    nextButton.hidden = step === 4;
    submitButton.hidden = step !== 4;
    showMessage('', '');
  }

  function getSelectedService() {
    return services.find(function (service) {
      return service.id === serviceSelect.value;
    });
  }

  function getSelectedBarber() {
    return barbers.find(function (barber) {
      return barber.nome === barberSelect.value;
    });
  }

  async function loadServices() {
    if (services.length) return;

    serviceSelect.disabled = true;
    serviceSelect.innerHTML = '<option value="">Carregando serviços...</option>';
    try {
      var data = await requestJson('/api/servicos');
      if (!Array.isArray(data)) throw new Error('A lista de serviços retornada pelo servidor é inválida.');
      services = data;
      serviceSelect.replaceChildren(new Option('Selecione um serviço', ''));
      services.forEach(function (service) {
        serviceSelect.add(new Option(service.nome + ' — ' + formatCurrency(service.preco), service.id));
      });
    } catch (error) {
      serviceSelect.replaceChildren(new Option('Não foi possível carregar os serviços', ''));
      showMessage(error.message, 'error');
    } finally {
      serviceSelect.disabled = false;
    }
  }

  function resetBarbers(placeholder) {
    barbersRequest++;
    barbers = [];
    barberSelect.replaceChildren(new Option(placeholder, ''));
    barberSelect.disabled = true;
  }

  async function loadBarbers(service) {
    var requestId = ++barbersRequest;
    barbers = [];
    barberSelect.replaceChildren(new Option('Carregando barbeiros...', ''));
    barberSelect.disabled = true;
    try {
      var data = await requestJson('/api/barbeiros?servico=' + encodeURIComponent(service.id));
      if (requestId !== barbersRequest) return;
      if (!Array.isArray(data)) throw new Error('A lista de barbeiros retornada pelo servidor é inválida.');

      if (!data.length) {
        barberSelect.replaceChildren(new Option('Nenhum barbeiro disponível para este serviço', ''));
        return;
      }

      barbers = data;
      barberSelect.replaceChildren(new Option('Selecione um barbeiro', ''));
      data.forEach(function (barber) {
        barberSelect.add(new Option(barber.nome, barber.nome));
      });
      barberSelect.disabled = false;
    } catch (error) {
      if (requestId !== barbersRequest) return;
      barberSelect.replaceChildren(new Option('Não foi possível carregar os barbeiros', ''));
      showMessage(error.message, 'error');
    }
  }

  function updateServiceDetail() {
    var service = getSelectedService();
    serviceDetail.textContent = service
      ? formatCurrency(service.preco) + ' · duração aproximada de ' + service.duracaoMinutos + ' minutos'
      : '';
    if (service) loadBarbers(service);
    else resetBarbers('Selecione um serviço primeiro');
    selectedTime = '';
    slotsContainer.replaceChildren();
  }

  function updateBarber() {
    selectedTime = '';
    slotsContainer.replaceChildren();
    if (dateInput.value && !isDateAvailable(parseIsoDate(dateInput.value))) dateInput.value = '';
    renderCalendar();
    if (dateInput.value) loadAvailability();
    else availabilityMessage.textContent = 'Selecione uma data no calendário para consultar os horários.';
  }

  async function loadAvailability() {
    var requestId = ++availabilityRequest;
    var service = getSelectedService();
    var barber = barberSelect.value;
    var date = dateInput.value;
    selectedTime = '';
    slotsContainer.replaceChildren();

    if (!service || !barber || !date) {
      availabilityMessage.textContent = 'Selecione um serviço, um barbeiro e uma data para consultar os horários.';
      return;
    }

    availabilityMessage.textContent = 'Consultando horários disponíveis...';
    try {
      var data = await requestJson(
        '/api/horarios-disponiveis?data=' + encodeURIComponent(date) +
        '&servico=' + encodeURIComponent(service.id) +
        '&barbeiro=' + encodeURIComponent(barber)
      );
      if (requestId !== availabilityRequest) return;

      var slots = Array.isArray(data.grade)
        ? data.grade
        : (data.horarios || []).map(function (time) { return { hora: time, disponivel: true }; });
      if (!Array.isArray(slots)) throw new Error('A lista de horários retornada pelo servidor é inválida.');
      if (!slots.length) {
        availabilityMessage.textContent = 'Não há atendimento nessa data. Escolha outro dia.';
        return;
      }

      var hasAvailable = slots.some(function (slot) { return slot.disponivel; });
      availabilityMessage.textContent = hasAvailable
        ? 'Selecione um horário disponível. Os horários em cinza já estão ocupados.'
        : 'Todos os horários dessa data já estão ocupados. Escolha outro dia.';
      slots.forEach(function (slot) {
        var time = slot.hora;
        var button = document.createElement('button');
        button.className = 'booking-slot';
        button.type = 'button';
        button.textContent = time;
        if (!slot.disponivel) {
          button.disabled = true;
          button.setAttribute('aria-label', time + ', indisponível');
          slotsContainer.appendChild(button);
          return;
        }
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', function () {
          selectedTime = time;
          Array.prototype.forEach.call(slotsContainer.children, function (slot) {
            if (!slot.disabled) slot.setAttribute('aria-pressed', slot === button ? 'true' : 'false');
          });
        });
        slotsContainer.appendChild(button);
      });
    } catch (error) {
      if (requestId === availabilityRequest) {
        availabilityMessage.textContent = error.message;
        showMessage(error.message, 'error');
      }
    }
  }

  function toIsoDate(date) {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  function parseIsoDate(value) {
    var parts = value.split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function getToday() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function getLastBookableDate() {
    var today = getToday();
    return new Date(today.getFullYear(), today.getMonth() + maxMonthsAhead + 1, 0);
  }

  // Dia disponível: entre hoje e o fim do último mês liberado, num dia de trabalho do barbeiro.
  function isDateAvailable(date) {
    if (date < getToday() || date > getLastBookableDate()) return false;

    var barber = getSelectedBarber();
    if (!barber || !Array.isArray(barber.dias)) return true;
    return barber.dias.indexOf(weekdayKeys[date.getDay()]) !== -1;
  }

  function selectDate(value) {
    dateInput.value = value;
    Array.prototype.forEach.call(calendarDays.querySelectorAll('.booking-calendar__day'), function (day) {
      day.setAttribute('aria-pressed', day.dataset.date === value ? 'true' : 'false');
    });
    loadAvailability();
  }

  function renderCalendar() {
    var today = getToday();
    var firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var lastMonth = new Date(today.getFullYear(), today.getMonth() + maxMonthsAhead, 1);
    if (!calendarMonth || calendarMonth < firstMonth || calendarMonth > lastMonth) calendarMonth = firstMonth;

    var year = calendarMonth.getFullYear();
    var month = calendarMonth.getMonth();
    var cells = [];

    calendarTitle.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(calendarMonth);
    calendarPrev.disabled = calendarMonth <= firstMonth;
    calendarNext.disabled = calendarMonth >= lastMonth;

    for (var blank = 0; blank < calendarMonth.getDay(); blank++) {
      cells.push(document.createElement('span'));
    }

    for (var day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
      var date = new Date(year, month, day);
      var value = toIsoDate(date);
      var button = document.createElement('button');
      button.className = 'booking-calendar__day';
      button.type = 'button';
      button.textContent = day;
      button.dataset.date = value;
      button.disabled = !isDateAvailable(date);
      button.setAttribute('aria-label', formatDate(value));
      button.setAttribute('aria-pressed', value === dateInput.value ? 'true' : 'false');
      if (date.getTime() === today.getTime()) button.setAttribute('aria-current', 'date');
      button.addEventListener('click', selectDate.bind(null, value));
      cells.push(button);
    }

    calendarDays.replaceChildren.apply(calendarDays, cells);
  }

  function changeCalendarMonth(offset) {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + offset, 1);
    renderCalendar();
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeZone: 'UTC'
    }).format(new Date(value + 'T12:00:00.000Z'));
  }

  function showSuccess(appointment) {
    document.getElementById('booking-success-id').textContent = '#' + appointment.id;
    document.getElementById('booking-success-service').textContent = appointment.servico;
    document.getElementById('booking-success-barber').textContent = appointment.barbeiro;
    document.getElementById('booking-success-date').textContent = formatDate(appointment.data);
    document.getElementById('booking-success-time').textContent = appointment.hora;
    form.hidden = true;
    success.hidden = false;
    document.getElementById('booking-success-title').focus();
  }

  function updateSummary() {
    var service = getSelectedService();
    document.getElementById('booking-summary-service').textContent = service ? service.nome : '';
    document.getElementById('booking-summary-barber').textContent = barberSelect.value;
    document.getElementById('booking-summary-date').textContent = formatDate(dateInput.value);
    document.getElementById('booking-summary-time').textContent = selectedTime;
    document.getElementById('booking-summary-name').textContent = nameInput.value.trim();
    document.getElementById('booking-summary-phone').textContent = phoneInput.value.trim();
  }

  function openModal(event) {
    if (event) event.preventDefault();
    lastOpener = event ? event.currentTarget : null;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    loadServices();
  }

  function finishClose() {
    modal.classList.remove('is-closing');
    if (typeof modal.close === 'function' && modal.open) modal.close();
    else modal.removeAttribute('open');
  }

  // Toca a animação de saída antes de fechar; sem animação (movimento reduzido), fecha direto.
  function closeModal() {
    if (!modal.open || modal.classList.contains('is-closing')) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof modal.close !== 'function') {
      finishClose();
      return;
    }

    modal.classList.add('is-closing');
    var fallback = window.setTimeout(onEnd, 400);
    function onEnd(event) {
      if (event && event.target !== modal) return;
      window.clearTimeout(fallback);
      modal.removeEventListener('animationend', onEnd);
      finishClose();
    }
    modal.addEventListener('animationend', onEnd);
  }

  document.querySelectorAll('.js-open-booking, a[href="#agendamento"]').forEach(function (opener) {
    opener.addEventListener('click', openModal);
  });
  document.querySelectorAll('[data-close-booking]').forEach(function (button) {
    button.addEventListener('click', closeModal);
  });
  modal.addEventListener('click', function (event) {
    if (event.target === modal) closeModal();
  });
  modal.addEventListener('cancel', function (event) {
    event.preventDefault();
    closeModal();
  });
  modal.addEventListener('close', function () {
    if (lastOpener && typeof lastOpener.focus === 'function') lastOpener.focus();
    form.reset();
    dateInput.value = '';
    calendarMonth = null;
    success.hidden = true;
    form.hidden = false;
    serviceDetail.textContent = '';
    resetBarbers('Selecione um serviço primeiro');
    slotsContainer.replaceChildren();
    availabilityMessage.textContent = 'Selecione uma data no calendário para consultar os horários.';
    selectedTime = '';
    setStep(1);
  });
  serviceSelect.addEventListener('change', updateServiceDetail);
  barberSelect.addEventListener('change', updateBarber);
  calendarPrev.addEventListener('click', changeCalendarMonth.bind(null, -1));
  calendarNext.addEventListener('click', changeCalendarMonth.bind(null, 1));
  nextButton.addEventListener('click', function () {
    if (currentStep === 1) {
      if (!serviceSelect.value) {
        serviceSelect.reportValidity();
        return;
      }
      if (!barberSelect.value) {
        if (barberSelect.disabled) showMessage('Não há barbeiro disponível para este serviço. Escolha outro serviço.', 'error');
        else barberSelect.reportValidity();
        return;
      }
      setStep(2);
      return;
    }
    if (currentStep === 2) {
      if (!dateInput.value) {
        showMessage('Escolha uma data no calendário para continuar.', 'error');
        return;
      }
      if (!selectedTime) {
        showMessage('Selecione um dos horários disponíveis para continuar.', 'error');
        return;
      }
      setStep(3);
      return;
    }
    if (currentStep === 3) {
      if (!nameInput.reportValidity() || !phoneInput.reportValidity()) return;
      updateSummary();
      setStep(4);
    }
  });
  backButton.addEventListener('click', function () {
    if (currentStep > 1) setStep(currentStep - 1);
  });
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (currentStep !== 4) return;

    var service = getSelectedService();
    var appointment = {
      nome: nameInput.value.trim(),
      telefone: phoneInput.value.trim(),
      servico: service.id,
      barbeiro: barberSelect.value,
      data: dateInput.value,
      hora: selectedTime
    };

    submitButton.disabled = true;
    showMessage('Enviando seu pedido de agendamento...', 'pending');
    try {
      var created = await requestJson('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      });
      showSuccess(created);
    } catch (error) {
      showMessage(error.message, 'error');
      if (error.message.indexOf('não está mais disponível') !== -1) {
        setStep(2);
        await loadAvailability();
      }
    } finally {
      submitButton.disabled = false;
    }
  });

  renderCalendar();
})();
