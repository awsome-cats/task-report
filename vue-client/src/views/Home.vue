<template>
<div id="app">
    <div id="gantt-header" class="h-12 p-2 flex items-center">
      <h1 class="text-xl font-bold">ガントチャート</h1>
    </div>
    <div id="gantt-content" class="flex" >
      <div id="gantt-task">
        <div id="gantt-task">
          <div id="gantt-task-title" class="flex items-center bg-blue-500 text-white h-20" ref="task">
            <div class="border-t border-r border-b flex items-center justify-center font-bold text-xs w-36 h-full">案件名
            </div>
            <div class="border-t border-r border-b flex items-center justify-center font-bold text-xs w-24 h-full">開始日
            </div>
            <div class="border-t border-r border-b flex items-center justify-center font-bold text-xs w-24 h-full">終了日
            </div>
            <div class="border-t border-r border-b flex items-center justify-center font-bold text-xs w-16 h-full">ユーザー名
            </div>
          </div>
          
          <div id="gantt-task-list" class="overflow-y-hidden" :style="`height:${calendarViewHeight}`">
            <div v-for="(task, index) in displayTasks" :key="index"
            class="flex h-10 border-b"
            >
            <template v-if="task.cat === 'category'">
              <div class="flex items-center font-bold w-ful text-sm pl-4">
                {{ task.name }}
              </div>
            </template>

            <template v-else>
              <div class="border-r flex items-center font-bold w-48 text-sm pl-4" >
                {{task.name}}
              </div>
              <div class="border-r flex items-center justify-center w-24 text-xs p-2">
                {{task.start_date}}
              </div>
              <div class="border-r flex items-center justify-center w-24 text-xs p-2">
                  {{task.end_date }}
              </div>
              <div class="border-r flex items-center justify-center w-16 text-xs">
                {{ task.incharge_user}}
              </div>
              <div class="flex items-center justify-content w-12 test-sm">
                {{ task.percentage}}
              </div>
            </template>
          </div>
        </div>
     </div>
     </div>

      <!-- カレンダー Start 
      overflow-x-scroll: x軸のスクロールを表示
      overflow-y-hidden: y軸のスクロールを非表示
      -->

      <div id="gantt-calendar"
      class="overflow-x-scroll overflow-y-hidden w-1/2 border-1"
      :style="`width:${calendarViewWidth}px`"
      ref="calendar"
      >

        <!-- 月 START -->
        <div id="gantt-date" class="h-20">
          <div id="gantt-year-month" class="relative h-8 text-xs">
            <div v-for="(calendar, index) in calendars"
            :key="index">
              <div class="bg-indigo-700 text-white border-b border-r border-t h-8 absolute font-bold text-xs items-center justify-center"
              :style="
              `width:${calendar.calendar*block_size}px;
              left:${calendar.start_block_number*block_size}px`"
              >
              <!-- 2020年10月 -->
              {{ calendar.date }}
              </div>
            </div>
          </div>
            <!-- 日にち START  -->
          <div id="gantt-day" class="relative h-12 text-xs">
            <div v-for="(calendar,index) in calendars"
            :key="index">
              <div v-for="(day,index) in calendar.days"
              :key="index">
                <div class="text-xs border-r border-b h-12 absolute flex items-center justify-center flex-col text-xs"
                :class="{
                  'bg-blue-100': day.dayOfWeek === '土',
                  'bg-red-100': day.dayOfWeek === '日',
                  'bg-red-600 test-white':calendar.year === today.year() && calendar.month === today.month() && day.day === today.date()}"
                :style="
                `width: ${block_size}px;left:${day.block_number*block_size}px`"
                >
                <!-- 日にちと曜日 -->
                <span class="text-xs">{{day.day}}</span>
                <span class="text-xs">{{day.dayOfWeek}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="gantt-height relative text-xs">
            <div v-for="(calendar, index) in calendars"
            :key="index">
              <div v-for="(day, index) in calendar.days"
              :key="index">
                <div class="fonts border-r border-b absolute text-xs"
                :style="
                `width:${block_size}px;
                left:${day.block_number*block_size}px;
                height:${calendarViewHeight}px`
                "
                >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 月 END -->

        <div id="gantt-bar-area" class="relative" :style="`width:${calendarViewWidth}px;
        height:${calendarViewHeight}px`"
        >
          <div v-for="(bar, index) in taskBars" :key="index">
            <div :style="bar.style" class="rounded-lg absolute h-5 bg-orange-200" v-if="bar.task.cat === 'task'">
              <div class="w-full h-full">
              </div>
            </div>
          </div>
        </div>

        <div id="gantt-height" class="relative">
          <div v-for="(calendar, index) in calendars" :key="index">
            <div v-for="(day, index) in calendar.days" :key="index">
              <div class="border-r border-b absolute"
              :class="{
                'bg-blue-100': day.dayOfWeek === '土',
                'bg-red-100': day.dayOfWeek === '日'}"
              :style="`width:${block_size}px;
                left:${day.block_number*block_size}px;
                height:${ calendarViewHeight }`"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 日にち END -->
      <!-- カレンダー End -->
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import moment from 'moment'
export default {
  data(){
      return {
          start_month: '2020-10',
          end_month: '2021-2',
          block_size: 16, // 一日の横幅 
          block_number: 0, // カレンダーの開始日
          calendars:[],
          inner_width: '',
          inner_height: '',
          task_width: '',
          task_height: '',
          today:moment(),
          apiTasks: [],
          position_id : 0,
          categories: [
            {
            id: 1,
            name: 'テストA',
            collapsed: false,
            }, {
            id: 2,
            name: 'テストB',
            collapsed: false,
            },
          ],
          tasks: [
            {
            id: 1,
            category_id: 1,
            name: 'テスト1',
            start_date: '2020-11-18',
            end_date: '2020-11-20',
            incharge_user: '力',
            percentage: 100,
            },
            {
            id: 2,
            category_id: 1,
            name: 'テスト2',
            start_date: '2020-11-19',
            end_date: '2020-11-23',
            incharge_user: '力',
            percentage: 90,
            },
            {
            id: 3,
            category_id: 1,
            name: 'テスト3',
            start_date: '2020-11-19',
            end_date: '2020-12-04',
            incharge_user: '力',
            percentage: 40,
            },
            {
            id: 4,
            category_id: 1,
            name:  'テスト4',
            start_date: '2020-11-21',
            end_date: '2020-11-30',
            incharge_user: '力',
            percentage: 60,
            },
            {
            id: 5,
            category_id: 1,
            name: 'テスト5',
            start_date: '2020-11-25',
            end_date: '2020-12-04',
            incharge_user: '力',
            percentage: 5,
            },
            {
            id: 6,
            category_id: 2,
            name:  'テスト6',
            start_date: '2020-11-28',
            end_date: '2020-12-08',
            incharge_user: '力',
            percentage: 0,
            },
            {
            id: 7,
            category_id: 1,
            name:  'テスト7',
            start_date: '2020-12-01',
            end_date: '2020-12-10',
            incharge_user: '力',
            percentage: 60,
            },
            {
            id: 8,
            category_id: 1,
            name: 'テスト8',
            start_date: '2020-12-02',
            end_date: '2020-12-04',
            incharge_user: '力',
            percentage: 5,
            },
            {
            id: 9,
            category_id: 2,
            name:  'テスト9',
            start_date: '2020-12-03',
            end_date: '2020-12-08',
            incharge_user: '力',
            percentage: 0,
            },
            {
            id: 10,
            category_id: 1,
            name:  'テスト10',
            start_date: '2020-12-04',
            end_date: '2020-11-30',
            incharge_user: '力',
            percentage: 60,
            },
            {
            id: 11,
            category_id: 1,
            name: 'テスト11',
            start_date: '2020-12-05',
            end_date: '2020-12-07',
            incharge_user: '力',
            percentage: 5,
            },
            {
            id: 12,
            category_id: 2,
            name:  'テスト12',
            start_date: '2020-12-07',
            end_date: '2020-12-08',
            incharge_user: '力',
            percentage: 0,
            },
        ],
      }
  },
  computed: {
    // カレンダーのwidthをもとめる
    calendarViewWidth() {
      return this.inner_width - this.task_width;
    },
    // カレンダーの高さを求める
    calendarViewHeight () {
      // 上部のheaderとタスク領域の高さを差し引く
      return this.inner_height - this.task_height -48 -20;
    },
    displayTasks() {
      let display_task_number = Math.floor(this.calendarViewHeight / 40);
      return this.lists.slice(this.position_id, this.position_id + display_task_number)
    },
    lists() {
      let lists = [];
      this.categories.map(category => {
        lists.push({ cat: 'category', ...category });
        this.tasks.map(task => {
          if (task.category_id === category.id) {
            lists.push({ cat: 'task', ...task })
          }
        })
      })
      console.log('lists', lists)
      return lists;
    },
    taskBars() {
      let start_date = moment(this.start_month);
      let top = 10;
      let left;
      let between;
      let start;
      let style;
      return this.displayTasks.map(task => {
        style = {}
        if(task.cat==='task'){
          let date_from = moment(task.start_date);
          let date_to = moment(task.end_date);
          between = date_to.diff(date_from, 'days');
          between++;
          start = date_from.diff(start_date, 'days');
          left = start * this.block_size;
          style = {
            top: `${top}px`,
            left: `${left}px`,
            width: `${this.block_size * between}px`,
          }
        }
        top = top + 40;
        return {
          style,
          task
        }
      })
    },
    scrollDistance() {
     let start_date = moment(this.start_month)
     let between_days = this.today.diff(start_date, 'days')
     return (between_days + 1) * this.block_size - this.calendarViewWidth /2;
   }
  },
  mounted: function() {
    console.log('getDays', this.getDays('2020','10',0)) // year, month, number
    this.getCalendar()
    this.getWindowSize()
    window.addEventListener('resize', this.getWindowSize, false)
    window.addEventListener('wheel', this.windowSizeCheck)
    this.$nextTick(() => {
      this.todayPosition()
    })
    // axios.get('http://localhost:3001/api/get/all')
    // .then(response => {
    //   console.log('response', response.data)
    //   this.apiTasks = response.data
    // })
  },
  methods: {
    // 日付と曜日を持った配列
    getDays(year, month, block_number) {
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
      let days = [];
      let date = moment(`${year}-${month}-01`);
      // num: 取得した月の日数
      // date()メソッド:日
      // year():年
      // day():曜日
      // 今日から1日後の日付
      let num = date.daysInMonth();
      for (let i = 0; i < num; i++) {
        days.push({
          day: date.date(),
          dayOfWeek: dayOfWeek[date.day()],
          block_number
        })
        date.add(1, 'day');
        block_number++;
      }
      return days;
   },
     getCalendar() {
      let block_number = 0;
      let days;
      // 始め月
      let start_month = moment(this.start_month)
      // 終わり月
      let end_month = moment(this.end_month)
      // 差分
      let between_month = end_month.diff(start_month, 'months')
      // 差分の月の分だけgetDaysを行う
      for (let i = 0; i <= between_month; i++) {
        days = this.getDays(start_month.year(), start_month.format('MM'), block_number);
        this.calendars.push({
          date: start_month.format('YYYY年MM月'),
          year: start_month.year(),
          month: start_month.month(), //month(), 0,1..11と表示
          start_block_number: block_number,
          calendar: days.length,
          days: days
        })
        start_month.add(1, 'months')
        block_number = days[days.length - 1].block_number
        block_number++;
     }
    return block_number;
   },
   // window sizeの取得
   getWindowSize() {
     this.inner_width = window.innerWidth
     this.inner_height = window.innerHeight
     this.task_width = this.$refs.task.offsetWidth
     this.task_height = this.$refs.task.offsetHeight
     // width: 400 height: 80とわかる
    //  console.log('task_widtj', this.task_width, 'task_height', this.task_height)
   },
   windowSizeCheck() {
     let height = this.lists.length - this.position_id
     if (event.deltaY > 0 && height * 40 > this.calendarViewHeight) {
       this.position_id++
     } else if (event.deltaY < 0 && this.position_id !==0)
     this.position_id--
   },
   
   todayPosition () {
     this.$refs.calendar.scrollLeft = this.scrollDistance
   }
  }
}
</script>

<style scoped>
.gantt-height > span {
  font-size: 8px;
  color: rgb(194, 35, 133);
}
</style>

