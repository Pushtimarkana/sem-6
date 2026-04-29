// Writte a program to implement recursive dec ent parser for foloowing gammer:
// E->E+T | T
// T->T*F |F
// F->id

//remove left recusion 
//E -> TE'
//E' -> +TE' |e
//T ->  FT'
//T' -> *FT' | e
//F -> id


#include<stdio.h>
int i = 0;
char str[]="id*id+id";
void main(){
    E();
}

void E(){
    T();
    E_();
}

void T(){
    F();
    T_();
}
void F(){
    if ( str[i] == 'i' && str[i+1] =='d'){
        i=i+2;
    }
}

void T_(){
    if(str[i]=='*'){
        i++;
    }
    F();
    T_();
}

void E_(){
    if(str[i]=='+'){
        i++;
    }
    T();
    E_();

}
