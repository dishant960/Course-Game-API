function init() {
    
    
    
    var stage = new createjs.Stage("myCanvas");
    var input="CREATE";
    var output="ETAERC";
    var container=[];
    var x=50;
    for(var i=0;i<6;i++)
    {
        container[i] = new createjs.Container();
        var shape = new createjs.Shape();
        shape.graphics.beginStroke("Red");
        shape.graphics.beginFill("White").drawRect(0, 0, 50, 50);
        shape.x=x;
        shape.y=50;
        var d=input.charAt(i);
        var text = new createjs.Text(d, "20px Arial", "#ff7700");
        text.x = x+10; 
        text.y = 60
        container[i].addChild(shape,text); 
        x=x+50;
        stage.addChild(container[i]);
    }
    var stack_container=[];
    
    x=150;
    for(var j=0;j<6;j++)
    {
        stack_container[j] = new createjs.Container();
        var stack_shape = new createjs.Shape();
        stack_shape.graphics.beginStroke("Black");
        stack_shape.graphics.drawRect(0, 0, 75, 50);
        stack_shape.x=50;
        stack_shape.y=x;
        var d1=input.charAt(j);
        stack_container[j].addChildAt(stack_shape,0); 
        x=x+50;
        stage.addChild(stack_container[j]);      
    }
    
    var push_container=new createjs.Container();
    var push_shape=new createjs.Shape();
    //push_shape.graphics.beginStroke("Blue");
    push_shape.graphics.beginFill("Black").drawRect(250, 200, 110, 75,25);
    var push_text=new createjs.Text("Push","20px Arial","#fff");
    push_text.x=280;
    push_text.y=225;
    push_container.addChild(push_shape,push_text);
    
    var pop_container=new createjs.Container();
    var pop_shape=new createjs.Shape();
    //push_shape.graphics.beginStroke("Blue");
    pop_shape.graphics.beginFill("SkyBlue").drawRect(250, 275, 110, 75,25);
    var pop_text=new createjs.Text("Pop","20px Arial","#fff");
    pop_text.x=280;
    pop_text.y=295;
    pop_container.addChild(pop_shape,pop_text);
   
    stage.addChild(push_container);
    stage.addChild(pop_container);
    push_shape.addEventListener("click",push);
    pop_shape.addEventListener("click",pop);
    var count=5;
    var count2=0;
    var new_string=input;
    var temp_string="";
    function push()
    {
        //var d=new_string.charAt(count2);
        var a1=container[0].getChildAt(1);
        //var t1=new createjs.Text(d,"20px Arial","#000");
        var temp=stack_container[count].getChildAt(0);
        //alert(temp.x);
        createjs.Tween.get(a1).to({x:temp.x+22,y:temp.y+10},1500,createjs.Ease.cubicInOut);
        
//        a1.y=temp.y+10;
//        a1.x=temp.x+22;
        container[0].removeChildAt(1);
        stack_container[count].addChildAt(a1,1);
//        stage.update();
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", stage);
        count2++;
    
        for(var i=1;i<=count;i++)
        {
            var s=container[i-1].getChildAt(0);
            var t=container[i].getChildAt(1);
            createjs.Tween.get(t).to({x:s.x+10,y:s.y+10},1500,createjs.Ease.cubicInOut);
            container[i].removeChildAt(1);
            container[i-1].addChildAt(t,1);
            createjs.Ticker.setFPS(60);
            createjs.Ticker.addEventListener("tick", stage);
                
        }
        count--;
        temp_string+=new_string.charAt(0);
        new_string=new_string.slice(1);
        //alert("pop "+" te "+temp_string+" nw "+new_string);
    }
    function pop()
    {
            var st_t=stack_container[count+1].getChildAt(1);
            var mn_s=container[count+1].getChildAt(0);
            createjs.Tween.get(st_t).to({x:mn_s.x+10,y:mn_s.y+10},1500,createjs.Ease.cubicInOut);
            stack_container[count+1].removeChildAt(1);
            container[count+1].addChildAt(st_t,1);
            createjs.Ticker.setFPS(60);
            createjs.Ticker.addEventListener("tick", stage);
            count++;
            count2--;
            new_string+=temp_string.charAt(temp_string.length-1);
            temp_string=temp_string.substring(0,temp_string.length-1);
            //alert("pop "+" te "+temp_string+" nw "+new_string);
            if(new_string == output)
            {
                alert("Congrats");    
            }
    }
    stage.update();
}
