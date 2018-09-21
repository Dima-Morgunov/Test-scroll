import React, { Component } from "react";
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import "./index.css";

class App extends Component {

    state = {
        searchMessage:{
            text:''
        },
        newMessage:{
            name: ``,
            text:'',
        },
        showChangeInput: null,
        MirrorArray:[],
        data:[],
        index: 0,
        scrollToLastMessage: 0,
        CheckboxValue: true,
        changeMessage:'',

    }

    scrollToPosition = () =>{
        if(this.scrollToLastMessage === undefined){
            this.setState({
                scrollToLastMessage: this.state.data.length,
                CheckboxValue: true
            })
        }
        if(this.scrollToLastMessage !== undefined){
            this.setState({
                scrollToLastMessage: undefined,
                CheckboxValue: false
            })
        }
    }
    ScrollToLastMessage = () => {
            this.setState({
                scrollToLastMessage: this.state.data.length
            })
    }
    onSearch  = e =>{
        var searchQuery = e.target.value.toLowerCase();
        if (e.target.value){
            var messageList = this.state.data.filter(element => {
                var searchValue = element.text.toLowerCase()
                return searchValue.indexOf(searchQuery) !== -1
            })
            this.setState({
                data: messageList
            });
        }
        if(this.state.data.length < this.state.MirrorArray.length) {
            var messageLis = this.state.MirrorArray.filter(element => {
                var searchValu = element.text.toLowerCase()
                return searchValu.indexOf(searchQuery) !== -1
            })
            this.setState({
                data: messageLis
            });
        }

        if(e.target.value === 0){
            this.setState({
                data: this.state.MirrorArray
            })
        }
    }
    createdMessages = () => {

        var list = []
        for (let i = 0; i < 10000; i++){
            list.push({
                name: new Date(),
                text: `this is ${i} elementqqqqqq qqqqqqqqqqq qqqqqqqqqqqq qqqqqqqqq qqqqqqqqqqqqq qqqqqqqqqq qqqqqqqqqq qq`,
                id: i,
                showAvatar: false,
                newDayBar: false
            })
        }
        this.setState({
            data: list,
            MirrorArray: list,
            scrollToLastMessage: this.state.data.length
        })

    }
    addNewMessage = () =>{
        let newMessageArray = this.state.MirrorArray
        var newMess = []
        newMess.name = new Date();
        newMess.id = 1 +this.state.MirrorArray.length
        newMess.text = this.state.newMessage.text
        if (this.state.MirrorArray.length >= 1){
            var showave = this.state.MirrorArray.length -1
            if (+newMess.name  -  +this.state.MirrorArray[showave].name> 90000){
                newMess.showAvatar = true
            }
            else{
                newMess.showAvatar = false
            }
        }
        if (this.state.MirrorArray.length >= 1){
            var showBar = this.state.MirrorArray.length -1
            if (+newMess.name.getDay()  -  +this.state.MirrorArray[showBar].name.getDay() >= 1){
                newMess.newDayBar = true
            }
            else{
                newMess.newDayBar = false
            }
        }
        newMessageArray.push(newMess)
        this.setState({
            data: newMessageArray,
            MirrorArray: newMessageArray,
            scrollToLastMessage: this.state.data.length

        })
    }
    componentDidMount() {
        this.createdMessages()

        this.setState({
            scrollToLastMessage: this.state.data.length
        })
        window.addEventListener('load', this.ScrollToLastMessage);
    }
    chandgeWidth(){
        this.cache.clearAll()
        return this.cache.rowHeight
    }
    constructor(props) {
        super(props);
        var cache = new CellMeasurerCache({
            defaultHeight: 100,
            fixedWidth: true,
        })
        this.cache = cache;
    }
    showChangeMenu = (e) =>{
        console.log(e.target)
        this.setState({
            showChangeInput: +e.target.id,
            changeMessage: this.state.data[+e.target.id].text
        })
    }
    onChange  = e =>{
        this.setState({
            newMessage: { ...this.state.newMessage, [e.target.name]: e.target.value }
        });
    }
    onChangeMessage  = e =>{
        this.setState({
            changeMessage: e.target.value,
        });
    }
    changeMessage = e =>{
        console.log(e.target.id)
        let newMessageArray = this.state.MirrorArray
        newMessageArray.map(element => {
            if(element.id == e.target.id) {
                element.text = this.state.changeMessage
            }
            return element
        })
        var count = parseInt(e.target.id)
        console.log(count)
        this.setState({
            data: newMessageArray,
            showChangeInput: undefined,
            scrollToLastMessage: count
        })
    }

    renderRow = ({ index, parent, key, style, isScrolling}) => {
        const {data, scrollToLastMessage, changeMessage, showChangeInput} = this.state

        if(isScrolling && scrollToLastMessage !== undefined) {
            this.setState({
                scrollToLastMessage: undefined,
                CheckboxValue: false
            })
        }
        return (
            <CellMeasurer
                cache={this.cache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
                style={style}
            >
                <div style={style} className='Row' >

                    {data[index]. newDayBar
                        ?
                        <div>{ new Date().toDateString()}</div>
                        :
                        null
                    }
                    {data[index].showAvatar
                        ?
                        <img className='image' src='https://img01-olxua.akamaized.net/img-olxua/683288194_1_261x203_odno-kmnatna-kvartira-v-tsentr-vul-chaykovskogo17-lvov.jpg' />
                        :
                        null

                    }
                    <div>{data[index].name.toDateString() }</div> <span className='span-block'>{data[index].text}</span>

                    {showChangeInput === index ?
                        <div>
                            <input
                                className='wrap-input'
                                type="text"
                                placeholder="Сообщение..."
                                value={changeMessage}
                                onChange={this.onChangeMessage}
                            />
                                <button
                                    id={data[index].id}
                                    className='wrap-changeButton'
                                    onClick={this.changeMessage}
                                >
                                    change
                                </button>
                        </div>
                         :
                        <input
                            type='button'
                            className='wrap-changeButton'
                            onClick={this.showChangeMenu}
                            id={index}
                            value='change'
                        />

                    }
                </div>
            </CellMeasurer>
        )

    }
    render() {
        const {newMessage, data, scrollToLastMessage, CheckboxValue} = this.state
        return (
            <AutoSizer>
                {
                    ({ width, height }) => {
                        return <div>
                            <List
                                ref = {this.setBodyRef}
                                deferredMeasurementCache={this.cache}
                                className='List'
                                width={width}
                                height={height}
                                rowCount={data.length}
                                rowHeight={this.chandgeWidth(width)}
                                rowRenderer={this.renderRow}
                                scrollToIndex={scrollToLastMessage}
                                sortBy={()=>
                                {
                                    this.list.forceUpdate();
                                }}
                            />
                            <div className='user'>
                                <input

                                    type="text"
                                    placeholder="Сообщение..."
                                    name='text'
                                    value={newMessage.text}
                                    onChange={this.onChange}
                                />
                                <button onClick={this.addNewMessage}>push</button>
                                <p>Найти сообщение по тексту</p>
                                <input
                                    type="text"
                                    placeholder="Поиск..."
                                    name='text'
                                    onChange={this.onSearch}

                                />
                            </div>
                        </div>
                    }}
            </AutoSizer>


        );
    }
}

export default App;
