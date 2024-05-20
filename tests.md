```


  jsonstor-mongodb Tests
    A) CRUD Tests
      ✔ should insert 100 documents, one at a time (748ms)
      ✔ should delete 100 documents, all at once (16ms)
      ✔ should insert 100 documents, all at once (19ms)
      ✔ should read 100 documents, one at a time (596ms)
      ✔ should replace 100 documents, one at a time (1289ms)
      ✔ should read 100 documents, all at once (6ms)
      ✔ should read 5 documents, all at once and sorted
      ✔ should update 100 documents, one at a time (716ms)
      ✔ should update 100 documents, all at once (9ms)
      ✔ should delete 100 documents, one at a time (639ms)
    B) Rainbow Tests
      Nested Fields (explicit)
        ✔ should not perform matching on nested fields using implicit $eq
        ✔ should not perform matching on nested fields using explicit $eq
      Nested Fields (dot notation)
        ✔ should perform matching on nested fields using implicit $eq and dot notation
        ✔ should perform matching on nested fields using explicit $eq and dot notation
      Operator $eq (===)
        ✔ should perform strict equality (===) on 'bns' (32ms)
        ✔ should perform strict equality (===) on 'o' (11ms)
        ✔ should perform strict equality (===) on 'a' (10ms)
        ✔ should not perform loose equality (==) on 'bns' (30ms)
        ✔ should not perform loose equality (==) on 'o' (11ms)
        ✔ should not perform loose equality (==) on 'a' (11ms)
        ✔ should equate null with an undefined field
      Operator $ne (!==)
        ✔ should perform strict inequality (!==) on 'bns' (31ms)
        ✔ should perform strict inequality (!==) on 'o'
        ✔ should perform strict inequality (!==) on 'a' (6ms)
        ✔ should not perform loose inequality (!=) on 'bns' (16ms)
        ✔ should not perform loose inequality (!=) on 'o'
        ✔ should not perform loose inequality (!=) on 'a'
      Operator $gte (>=)
        ✔ should perform strict comparison (>=) on 'bns' (35ms)
        ✔ should not perform loose comparison (>=) on 'bns' (16ms)
        ✔ should equate null with an undefined field (6ms)
      Operator $gt (>)
        ✔ should perform strict comparison (>=) on 'bns' (16ms)
        ✔ should not perform loose comparison (>=) on 'bns' (16ms)
      Operator $lte (<=)
        ✔ should perform strict comparison (<=) on 'bns' (15ms)
        ✔ should not perform loose comparison (<=) on 'bns' (16ms)
        ✔ should equate null with an undefined field (6ms)
      Operator $lt (<)
        ✔ should perform strict comparison (<) on 'bns' (17ms)
        ✔ should not perform loose comparison (<) on 'bns' (17ms)
    C) UserInfo Permissions Tests
      Alice, Bob, and Eve scenario
        ✔ Should add documents and set permissions (136ms)
        ✔ Alice should read all documents and write all documents (224ms)
        ✔ Bob should read some documents and write some documents (427ms)
        ✔ Eve should read some documents and write some documents (202ms)
        ✔ Public objects should be readable by everyone (234ms)
        ✔ Public objects should only be writable by the owner (163ms)
        ✔ Should not allow readers to update documents (269ms)
    M) MongoDB Tutorial
      Query Documents (https://www.mongodb.com/docs/manual/tutorial/query-documents/)
        Select All Documents in a Collection
          ✔ Match All Documents with an Empty Object {}
        Specify Equality Condition
          ✔ Match Fields with Implicit Equality (7ms)
        Specify Conditions Using Query Operators
          ✔ Match Fields with an Array of Possible Values (6ms)
        Specify AND Conditions
          ✔ Match Fields with an Array of Possible Values (6ms)
        Specify OR Conditions
          ✔ Match Fields against an Array of Possible Values
        Specify AND as well as OR Conditions
          ✔ Match Fields Using AND and OR
      Query on Embedded/Nested Documents (https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/)
        Query on Embedded/Nested Documents
          ✔ Specify Equality Match on a Nested Field
          ✔ Specify Match using Query Operator
          ✔ Specify AND Condition
        Match an Embedded/Nested Document
          ✔ Specify Equality Match on an Embedded Document (11ms)
      Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
        Match an Array
          ✔ Match an Array Exactly (6ms)
          ✔ Match Array Elements
        Query an Array for an Element
          ✔ Match a Single Array Element
          ✔ Match Array Elements by Comparison (6ms)
        Specify Multiple Conditions for Array Elements
          ✔ Query an Array with Compound Filter Conditions on the Array Elements (6ms)
          ✔ Query for an Array Element that Meets Multiple Criteria (6ms)
          ✔ Query for an Element by the Array Index Position (6ms)
          ✔ Query an Array by Array Length
      Query an Array of Embedded Documents (https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/)
        Query for a Document Nested in an Array
          ✔ Match a Document Exactly
        Specify a Query Condition on a Field in an Array of Documents
          ✔ Specify a Query Condition on a Field Embedded in an Array of Documents
          ✔ Use the Array Index to Query for a Field in the Embedded Document (6ms)
        Specify Multiple Conditions for Array of Documents
          ✔ A Single Nested Document Meets Multiple Query Conditions on Nested Fields (10ms)
          ✔ Combination of Elements Satisfies the Criteria (11ms)
      Query for Null or Missing Fields (https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)
        Equality Filter
          ✔ Match Fields that are Null or Missing (8ms)
        Type Check
          ✔ Match Fields that Exist And are Null (7ms)
        Existence Check
          ✔ Match Fields that are Missing (7ms)
    N) MongoDB Reference
      Comparison Query Operators
        Comparison Operator: $eq (https://www.mongodb.com/docs/manual/reference/operator/query/eq/)
          Equals an Array Value
            ✔ Match an Array Element (6ms)
            ✔ Match an Array Element Using Implicit $eq
          Regex Match Behaviour
            ✔ $eq match on a string (10ms)
            ✔ $eq match on a regular expression
            ✔ Use the $in Operator with a Regular Expression (10ms)
        Comparison Operator: $gt (https://www.mongodb.com/docs/manual/reference/operator/query/gt/)
          ✔ Match Document Fields
        Comparison Operator: $gte (https://www.mongodb.com/docs/manual/reference/operator/query/gte/)
          ✔ Match Document Fields
        Comparison Operator: $in (https://www.mongodb.com/docs/manual/reference/operator/query/in/)
          ✔ Use the $in Operator to Match Values (6ms)
          ✔ Use the $in Operator to Match Values in an Array (6ms)
          ✔ Use the $in Operator with a Regular Expression (6ms)
        Comparison Operator: $lt (https://www.mongodb.com/docs/manual/reference/operator/query/lt/)
          ✔ Match Document Fields
        Comparison Operator: $lte (https://www.mongodb.com/docs/manual/reference/operator/query/lte/)
          ✔ Match Document Fields (6ms)
        Comparison Operator: $ne (https://www.mongodb.com/docs/manual/reference/operator/query/ne/)
          ✔ Match Document Fields (6ms)
        Comparison Operator: $nin (https://www.mongodb.com/docs/manual/reference/operator/query/nin/)
          ✔ Select on Unmatching Documents (6ms)
          ✔ Select on Elements Not in an Array (7ms)
      Logical Query Operators
        Logical Operator: $and (https://www.mongodb.com/docs/manual/reference/operator/query/and/)
          ✔ AND Queries With Multiple Expressions Specifying the Same Field (12ms)
          ✔ AND Queries With Multiple Expressions Specifying the Same Operator (6ms)
        Logical Operator: $not (https://www.mongodb.com/docs/manual/reference/operator/query/not/)
          ✔ Match Document Fields (6ms)
          ✔ $not and Regular Expressions (18ms)
        Logical Operator: $nor (https://www.mongodb.com/docs/manual/reference/operator/query/nor/)
          ✔ $nor Query with Two Expressions (6ms)
          ✔ $nor and Additional Comparisons (6ms)
          ✔ $nor and $exists
        Logical Operator: $or (https://www.mongodb.com/docs/manual/reference/operator/query/or/)
          ✔ Match Document Fields (6ms)
          ✔ $or versus $in (10ms)
          ✔ Nested $or Clauses (6ms)
      Element Query Operators
        Element Query Operator: $exists (https://www.mongodb.com/docs/manual/reference/operator/query/exists/)
          ✔ Exists and Not Equal To (90ms)
          ✔ Null Values (47ms)
        Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/)
          ✔ Querying by Data Type (BSON Code) (12ms)
          ✔ Querying by Data Type (BSON Alias) (11ms)
          ✔ Querying by Data Type ("number")
          ✔ Querying by Multiple Data Type (BSON Code) (155ms)
          ✔ Querying by Multiple Data Type (BSON Alias) (66ms)
      Array Query Operators
        Array Query Operator: $all (https://www.mongodb.com/docs/manual/reference/operator/query/all/)
          ✔ Use $all to Match Values
          ✔ Use $all with $elemMatch (6ms)
          ✔ Use $all with Scalar Values (7ms)
        Array Query Operator: $elemMatch (https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/)
          ✔ Element Match (84ms)
          ✔ Array of Embedded Documents (37ms)
          ✔ Single Query Condition (43ms)
        Array Query Operator: $size (https://www.mongodb.com/docs/manual/reference/operator/query/size/)
          ✔ Use $size to Match Array Sizes (62ms)
    Z) Ad-Hoc Tests
      ✔ should not match explicit nested fields (52ms)
      ✔ should sort and limit in FindMany2 (115ms)


  111 passing (8s)

```
