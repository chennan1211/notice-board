
import wangEditor from 'wangeditor'

export const NoticeModalForm = {
    props: ['canCancel', 'isEdit', 'notice'],
    template: `
            <form action="">
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">
                        <p class="modal-card-title">{{isEdit? '编辑':'新建'}}</p>
                        <button
                            type="button"
                            class="delete"
                            @click="$emit('close')"/>
                    </header>
                    <section class="modal-card-body">
                        <b-field label="标题">
                            <b-input
                                type="text"
                                v-model="title">
                            </b-input>
                        </b-field>

                        <b-field label="发布日期">
                            <b-datepicker
                                v-model="time"
                                placeholder="点击选择..."
                                :locale="locale"
                                icon="calendar-today"
                                trap-focus>
                            </b-datepicker>
                        </b-field>

                        <b-field label="正文">
                            <div id="demo1"></div>
                        </b-field>
                        
                    </section>
                    <footer class="modal-card-foot">
                    <b-button
                        label="发布"
                        type="is-primary" 
                        @click="$emit('publish',{title, text, time}) && $emit('close')"/>
                        <b-button
                            label="关闭"
                            @click="() => {this.title = '';this.text = '';this.$emit('close')}" />
                        
                    </footer>
                </div>
            </form>
        `,
    data: function () {
        return {
            title: '',
            text: '',
            time: new Date(),
            editor: null,
            locale: undefined

        }
    },
    mounted() {
        const editor = new wangEditor(`#demo1`)
        editor.config.onchange = (newHtml) => {
            this.text = newHtml
        }
        editor.create()
        this.editor = editor


        this.title = this.notice.title
        this.text = this.notice.text
        this.editor.txt.html(this.notice.text)
        this.time = new Date(this.notice.time)
    },
    beforeDestroy() {
        this.editor.destroy()
        this.editor = null
    }
}