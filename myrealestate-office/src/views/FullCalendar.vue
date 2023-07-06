<script>
import { ref } from 'vue'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { identity } from '@fullcalendar/core/internal'
import { getRelevantEvents } from '@fullcalendar/core/internal'


const id = ref(10)

export default {
    components: {
        FullCalendar // make the <FullCalendar> tag available
    },
    data() {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listDay' // user can switch between the two
                },
                dateClick: this.handleDateClick,
                events: [
                    { title: 'event 1', date: '2023-07-08', currentHour: '22:13:11' },
                    { title: 'event 1', date: '2023-07-07', currentHour: '22:13:11' },
                ],
                eventClick: this.handleDeleteClick,
                editable: true,
                selectable: true,
                select: (arg) => {
                    identity.value = id.value + 1
                    const cal = arg.view.calendar
                    cal.unselect()
                    cal.addEvent({
                        id: `${id.value}`,
                        title: `New event ${id.value}`,
                        start: arg.start,
                        end: arg.end,
                        allDay: true
                    })
                },
           
             

            }
        }
    },
    methods: {
        handleDateClick: function (arg) {
            let message = prompt('Enter title');
            let date = new Date();
            let currentDate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            if (message.length != 0) {
                let obj = { title: message, date: arg.dateStr, currentHour: currentDate };
                this.calendarOptions.events.push(obj);
                obj = {}
                console.log(obj);
            } else {
                return 0;
            }
        },
        handleDeleteClick: function (arg) {

            console.log(arg.event.title);
        },
    }
}
</script>
<template>
    <div class="container">
        <FullCalendar :options="calendarOptions" :header="{
            left: 'title',
            center: 'dayGridMonth, timeGridWeek, timeGridDay, listWeek',
            right: 'prev today next'
        }">
            <template v-slot:eventContent='arg'>
                <b>{{ arg.event.title }}</b><br>
                <b>{{ arg.event.extendedProps.currentHour }}</b><br>

            </template>
        </FullCalendar>
    </div>
</template>